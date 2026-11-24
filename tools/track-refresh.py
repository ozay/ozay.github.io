#!/usr/bin/env python3
"""
Fetch the live review status of open manuscripts for the tracker page.

    python3 tools/track-refresh.py

Reads assets/data/manuscripts.json. For every submission that is still open
and has a tracking link from one of the two services below, it asks that
service for the current state and writes assets/data/manuscripts-track.json.
The page reads that file and shows a "Live" panel on the card.

The deploy workflow runs this before every publish (and once a day on a
schedule), so the file exists only on the published site. It is git-ignored:
the fetched state is never committed, and so never collides with edits saved
from the page.

Supported links
- Elsevier "track your submission":
    https://track.authorhub.elsevier.com/?uuid=<uuid>
  Peer-review progress only: reviews completed / accepted / invited, the last
  review activity and the revision number. It never says what was decided.
- Research Square (Springer Nature "In Review"):
    https://www.researchsquare.com/article/rs-<n>/v<k>
  The preprint's state and its editorial timeline, decisions included.

A link that fails is recorded with its error and skipped; this script never
fails the deploy.
"""

import datetime
import json
import os
import re
import sys
import urllib.parse
import urllib.request

UA = "Mozilla/5.0 (compatible; manuscript-status-refresh)"
ELSEVIER_API = "https://tnlkuelk67.execute-api.us-east-1.amazonaws.com/tracker/{uuid}"
RS_API = "https://www.researchsquare.com/api/article/{ident}/v{version}"

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "assets", "data", "manuscripts.json")
OUT = os.path.join(ROOT, "assets", "data", "manuscripts-track.json")

CLOSED = {"accepted", "rejected", "withdrawn", "returned"}

# Elsevier's own tracker page labels its numeric codes this way; anything it
# does not list it calls "Review Complete".
ELSEVIER_STATUS = {3: "Under Review", 23: "Under Review", 4: "Required Reviews Complete"}

RS_STATUS = {
    "under-review": "Under review",
    "in-revision": "In revision",
    "published-in-journal": "Published in journal",
}
RS_EVENT = {
    "submitted": "Submitted to journal",
    "checksComplete": "Journal checks complete",
    "editorInvited": "Editor invited",
    "editorAssigned": "Editor assigned",
    "reviewersInvited": "Reviewers invited",
    "editorInvitedReview": "Reviewer invited",
    "reviewerAgreed": "Reviewer agreed",
}


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def day(value):
    """An ISO date from an epoch number or an ISO timestamp."""
    if value in (None, ""):
        return ""
    if isinstance(value, (int, float)):
        return datetime.datetime.fromtimestamp(value, datetime.timezone.utc).date().isoformat()
    return str(value)[:10]


def elsevier(uuid):
    d = get(ELSEVIER_API.format(uuid=uuid))
    rs = d.get("ReviewSummary") or {}
    return {
        "source": "elsevier",
        "status": ELSEVIER_STATUS.get(d.get("Status"), "Review Complete"),
        "lastActivity": day(d.get("LastUpdated")),
        "revision": d.get("LatestRevisionNumber") or 0,
        "reviews": {
            "completed": str(rs.get("ReviewsCompleted", "")),
            "accepted": str(rs.get("ReviewInvitationsAccepted", "")),
            "invited": str(rs.get("ReviewInvitationsSent", "")),
        },
        "msid": d.get("PubdNumber", ""),
    }


def research_square(ident, version):
    d = get(RS_API.format(ident=ident, version=version))
    d = d.get("result", d)
    versions = d.get("nonDraftVersions") or []
    latest = versions[-1] if versions else {}
    events = [e for e in (latest.get("editorialEvents") or []) if e.get("date")]
    events.sort(key=lambda e: e["date"])
    decisions = [e for e in events if e.get("type") == "decision"]
    last = events[-1] if events else None
    out = {
        "source": "researchsquare",
        "status": RS_STATUS.get(d.get("status"), str(d.get("status") or "").replace("-", " ").capitalize()),
        "lastActivity": day(last["date"]) if last else day(d.get("updatedAt")),
        "lastEvent": (RS_EVENT.get(last["type"], last.get("content") or last["type"]) if last else ""),
        "revision": max(0, len(versions) - 1),   # version 1 is the original, as Elsevier's 0
        # Invitations are logged under more than one event type, so a count of
        # them does not square with the agreements; report agreements only.
        "reviews": {"accepted": str(sum(e["type"] == "reviewerAgreed" for e in events))},
        "accepted": d.get("isAcceptedByJournal") is True,
        "deskRejected": d.get("isDeskRejected") is True,
        "journal": (d.get("journal") or {}).get("title", ""),
    }
    if decisions:
        out["decision"] = {"text": decisions[-1].get("content", ""), "date": day(decisions[-1]["date"])}
    return out


def parse(link):
    """Which service a link belongs to, and the identifiers to ask it with."""
    u = urllib.parse.urlparse(link)
    host = u.netloc.lower()
    if host.endswith("authorhub.elsevier.com"):
        uuid = (urllib.parse.parse_qs(u.query).get("uuid") or [""])[0]
        if re.fullmatch(r"[0-9a-fA-F-]{36}", uuid):
            return lambda: elsevier(uuid)
    if host.endswith("researchsquare.com"):
        m = re.search(r"/article/(rs-\d+)(?:/v(\d+))?", u.path)
        if m:
            return lambda: research_square(m.group(1), m.group(2) or "1")
    return None


def main():
    with open(SRC, encoding="utf-8") as f:
        subs = json.load(f)["submissions"]
    items = {}
    for s in subs:
        link = (s.get("link") or "").strip()
        if not link or s.get("status") in CLOSED or link in items:
            continue
        fetch = parse(link)
        if not fetch:
            continue
        try:
            items[link] = dict(fetch(), ok=True)
            print(f"ok    {s['ref']}  {items[link]['status']}")
        except Exception as e:  # one dead link must not cost the others
            items[link] = {"ok": False, "error": str(e)[:200]}
            print(f"fail  {s['ref']}  {e}", file=sys.stderr)
    out = {"fetched": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "items": items}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"wrote {os.path.relpath(OUT, ROOT)} with {len(items)} links")


if __name__ == "__main__":
    main()
