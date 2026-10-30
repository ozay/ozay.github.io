#!/usr/bin/env python3
"""
Rebuild assets/data/chess.js from the Chess.com public API.

    python3 tools/chess-refresh.py

Downloads every monthly game archive for the player named in USERNAME, derives
the figures the chess page draws, and writes assets/data/chess.js. Nothing else
in the site needs touching; the page reads that one file.

The API is public and needs no key. It does ask for a descriptive User-Agent.
Archives are cached under tools/.chess-cache/ so a re-run only fetches the
months that have changed. Delete that folder to force a full download.
"""

import collections
import datetime
import json
import os
import re
import statistics
import sys
import urllib.request

USERNAME = "ozay"
UA = "ozay.in personal site (https://ozay.in) - chess page data refresh"
TZ = datetime.timezone(datetime.timedelta(hours=3))      # Istanbul, for "when I play"

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(HERE, ".chess-cache")
OUT = os.path.join(ROOT, "assets", "data", "chess.js")


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def archives():
    """Every monthly archive, cached except for the two most recent months."""
    os.makedirs(CACHE, exist_ok=True)
    urls = get("https://api.chess.com/pub/player/%s/games/archives" % USERNAME)["archives"]
    out = []
    for i, u in enumerate(urls):
        y, m = u.split("/")[-2:]
        path = os.path.join(CACHE, "%s-%s.json" % (y, m))
        fresh = i >= len(urls) - 2          # the current month is still being played
        if os.path.exists(path) and not fresh:
            out += json.load(open(path)).get("games", [])
            continue
        data = get(u)
        json.dump(data, open(path, "w"))
        out += data.get("games", [])
    return out


def pgn_tags(pgn):
    d = {}
    for line in pgn.splitlines():
        m = re.match(r'\[(\w+) "(.*)"\]$', line.strip())
        if m:
            d[m.group(1)] = m.group(2)
        elif not line.strip() and d:
            break
    return d


# Opening slugs are chess.com's own. These are the ones that need an apostrophe
# or an accent putting back; anything else reads correctly with plain spaces.
NAME_FIXES = {
    "Kings": "King's", "Queens": "Queen's", "Bishops": "Bishop's",
    "Petrovs": "Petrov's", "Englund": "Englund", "Van t": "Van't",
    "Lopez": "López", "Reti": "Réti", "Bird": "Bird",
}
# A family ends at the first of these words: everything after it is a variation.
FAMILY_END = {"Opening", "Defense", "Defence", "Game", "Gambit", "Attack",
              "System", "Countergambit", "Variation"}


def pretty(slug):
    s = slug.replace("-", " ")
    for a, b in NAME_FIXES.items():
        s = re.sub(r"\b%s\b" % a, b, s)
    return s


def family(slug):
    words = slug.split("-")
    for i, w in enumerate(words):
        if w in FAMILY_END:
            return pretty("-".join(words[:i + 1]))
    return pretty("-".join(words[:3]))


DRAW_RESULTS = {"stalemate", "agreed", "repetition", "insufficient",
                "50move", "timevsinsufficient"}


def load():
    rows = []
    for g in archives():
        if g.get("time_class") != "rapid" or not g.get("rated"):
            continue
        t = pgn_tags(g["pgn"])
        me_is_white = g["white"]["username"].lower() == USERNAME
        mine = g["white"] if me_is_white else g["black"]
        opp = g["black"] if me_is_white else g["white"]
        res = mine["result"]
        out = "win" if res == "win" else ("draw" if res in DRAW_RESULTS else "loss")

        body = g["pgn"].split("\n\n", 1)[-1]
        nums = re.findall(r"(\d+)\.\s", body)
        first = re.search(r"1\.\s*(\S+)", body)
        reply = re.search(r"1\.\s*\S+\s*(?:\{[^}]*\})?\s*1\.\.\.\s*(\S+)", body)

        dur = None
        if t.get("StartTime") and t.get("EndTime"):
            try:
                a = datetime.datetime.strptime(t["StartTime"], "%H:%M:%S")
                b = datetime.datetime.strptime(t["EndTime"], "%H:%M:%S")
                dur = (b - a).total_seconds()
                if dur < 0:
                    dur += 86400
            except ValueError:
                pass

        acc = g.get("accuracies") or {}
        rows.append(dict(
            end=g["end_time"],
            dt=datetime.datetime.fromtimestamp(g["end_time"], TZ),
            colour="white" if me_is_white else "black",
            out=out,
            rating=mine["rating"],
            opp=opp["rating"],
            oppname=opp["username"],
            slug=(t.get("ECOUrl") or "").rsplit("/", 1)[-1],
            term=t.get("Termination", ""),
            moves=int(nums[-1]) if nums else 0,
            dur=dur,
            acc=acc.get("white" if me_is_white else "black"),
            first=first.group(1) if first else None,
            reply=reply.group(1) if reply else None,
        ))
    rows.sort(key=lambda r: r["end"])
    return rows


def record(rows):
    w = sum(r["out"] == "win" for r in rows)
    l = sum(r["out"] == "loss" for r in rows)
    d = sum(r["out"] == "draw" for r in rows)
    return {"w": w, "l": l, "d": d, "n": len(rows),
            "score": round(100 * (w + 0.5 * d) / max(1, len(rows)), 1)}


def main():
    rows = load()
    if not rows:
        sys.exit("no rated rapid games found")

    # Play restarted after a long lay-off. The rating line is unreadable across
    # a four-year gap, so mark where the current run begins: the first game
    # after the last break of more than 90 days.
    run_from = rows[0]
    for a, b in zip(rows, rows[1:]):
        if b["end"] - a["end"] > 90 * 86400:
            run_from = b
    run = [r for r in rows if r["end"] >= run_from["end"]]
    stats = get("https://api.chess.com/pub/player/%s/stats" % USERNAME)
    prof = get("https://api.chess.com/pub/player/%s" % USERNAME)
    rapid = stats.get("chess_rapid", {})

    # --- rating, one point per day played -------------------------------
    by_day = collections.OrderedDict()
    for r in rows:
        by_day[r["dt"].strftime("%Y-%m-%d")] = r["rating"]
    rating = [{"d": k, "r": v} for k, v in by_day.items()]

    # --- months ----------------------------------------------------------
    months = collections.OrderedDict()
    for r in rows:
        months.setdefault(r["dt"].strftime("%Y-%m"), []).append(r)
    monthly = [dict(m=k, end=v[-1]["rating"], **record(v))
               for k, v in months.items() if len(v) >= 5]

    # --- how games end, from my side -------------------------------------
    def ending(r):
        t = r["term"]
        if "drawn by" in t:
            return "draw", t.split("drawn by ")[1]
        who = "win" if t.lower().startswith(USERNAME.lower()) else "loss"
        how = t.split(" won ")[1] if " won " in t else t
        return who, how.replace("- game ", "").strip()

    endings = collections.defaultdict(collections.Counter)
    for r in rows:
        side, how = ending(r)
        endings[side][how] += 1

    # --- openings ---------------------------------------------------------
    fams = collections.defaultdict(list)
    named = collections.defaultdict(list)
    for r in rows:
        if not r["slug"]:
            continue
        fams[(r["colour"], family(r["slug"]))].append(r)
        named[(r["colour"], pretty(r["slug"]))].append(r)

    def top(d, colour, k, minimum):
        picked = [(key[1], v) for key, v in d.items() if key[0] == colour and len(v) >= minimum]
        picked.sort(key=lambda x: -len(x[1]))
        return [dict(name=name, **record(v)) for name, v in picked[:k]]

    # --- first moves ------------------------------------------------------
    def moves_count(key, colour, k):
        c = collections.defaultdict(list)
        for r in rows:
            if r["colour"] == colour and r[key]:
                c[r[key]].append(r)
        picked = sorted(c.items(), key=lambda x: -len(x[1]))[:k]
        return [dict(name=m, **record(v)) for m, v in picked]

    # --- how closely the pairing matched -----------------------------------
    # The API reports both players' ratings AFTER the game, which would make a
    # raw "opponent minus me" gap a restatement of the result. Reconstruct the
    # opponent's rating going in: whatever I gained this game, they lost.
    pairing_gaps = []
    prev = None
    for r in rows:
        if prev is not None:
            pairing_gaps.append(abs((r["opp"] + (r["rating"] - prev)) - prev))
        prev = r["rating"]

    # --- when I play (Istanbul time) --------------------------------------
    hours = collections.defaultdict(list)
    days = collections.defaultdict(list)
    for r in rows:
        hours[r["dt"].hour].append(r)
        days[r["dt"].weekday()].append(r)

    # --- game length ------------------------------------------------------
    lens = collections.defaultdict(list)
    for r in rows:
        b = min(5, max(0, (r["moves"] - 1) // 15))
        lens[b].append(r)

    # --- streaks ----------------------------------------------------------
    best = cur = worst = curl = 0
    for r in rows:
        cur = cur + 1 if r["out"] == "win" else 0
        curl = curl + 1 if r["out"] == "loss" else 0
        best, worst = max(best, cur), max(worst, curl)

    accs = [r["acc"] for r in rows if r["acc"]]
    durs = [r["dur"] for r in rows if r["dur"]]
    mv = [r["moves"] for r in rows if r["moves"]]

    data = {
        "username": USERNAME,
        "profileUrl": prof.get("url"),
        "avatar": prof.get("avatar"),
        "joined": datetime.datetime.fromtimestamp(prof["joined"], datetime.timezone.utc).strftime("%Y-%m-%d"),
        "asOf": datetime.datetime.now(TZ).strftime("%Y-%m-%d"),
        "timeControl": "600",
        "snapshot": {
            "rating": rapid.get("last", {}).get("rating"),
            "best": rapid.get("best", {}).get("rating"),
            "bestDate": datetime.datetime.fromtimestamp(
                rapid["best"]["date"], datetime.timezone.utc).strftime("%Y-%m-%d") if rapid.get("best") else None,
            "bestGame": rapid.get("best", {}).get("game"),
            "record": rapid.get("record", {}),
            "puzzleBest": stats.get("tactics", {}).get("highest", {}).get("rating"),
        },
        "totals": dict(
            record(rows),
            peak=max(r["rating"] for r in rows),
            trough=min(r["rating"] for r in rows),
            first=rows[0]["dt"].strftime("%Y-%m-%d"),
            last=rows[-1]["dt"].strftime("%Y-%m-%d"),
            days=len({r["dt"].date() for r in rows}),
            hours=round(sum(durs) / 3600) if durs else None,
            opponents=len({r["oppname"].lower() for r in rows}),
            runFrom=run_from["dt"].strftime("%Y-%m-%d"),
            runGames=len(run),
            runRecord=record(run),
            runPeak=max(r["rating"] for r in run),
            runTrough=min(r["rating"] for r in run),
            medianMoves=int(statistics.median(mv)) if mv else None,
            longestWin=best, longestLoss=worst,
        ),
        "rating": rating,
        "monthly": monthly,
        "colour": {c: record([r for r in rows if r["colour"] == c]) for c in ("white", "black")},
        "endings": {k: [{"name": n, "n": c} for n, c in v.most_common()] for k, v in endings.items()},
        "openings": {c: top(fams, c, 8, 10) for c in ("white", "black")},
        "lines": {c: top(named, c, 6, 7) for c in ("white", "black")},
        "firstMoves": {"white": moves_count("first", "white", 5),
                       "black": moves_count("reply", "black", 5)},
        "pairing": {
            "within15": round(100 * sum(g <= 15 for g in pairing_gaps) / len(pairing_gaps), 1),
            "median": int(statistics.median(pairing_gaps)),
            "n": len(pairing_gaps),
        },
        "hours": [dict(h=h, **record(hours[h])) for h in range(24) if hours[h]],
        "weekdays": [dict(wd=d, **record(days[d])) for d in range(7) if days[d]],
        "lengths": [dict(b=b, **record(lens[b])) for b in sorted(lens)],
        "accuracy": {
            "n": len(accs),
            "mean": round(statistics.mean(accs), 1) if accs else None,
            "wins": round(statistics.mean([r["acc"] for r in rows if r["acc"] and r["out"] == "win"]), 1) if accs else None,
            "losses": round(statistics.mean([r["acc"] for r in rows if r["acc"] and r["out"] == "loss"]), 1) if accs else None,
        },
    }

    header = (
        "/* ---------------------------------------------------------------------------\n"
        "   Chess figures, derived from the Chess.com public API.\n\n"
        "   GENERATED FILE — do not edit by hand. Rebuild it with:\n"
        "       python3 tools/chess-refresh.py\n\n"
        "   The chess page refreshes the headline rating and record live from the API\n"
        "   on every visit; everything below is the deeper reading of the game archive,\n"
        "   which is too much to download in the browser. \"asOf\" is when it was built.\n"
        "--------------------------------------------------------------------------- */\n\n"
        "window.SITE_CHESS = "
    )
    with open(OUT, "w") as f:
        f.write(header + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    print("wrote %s (%d games, %.0f KB)" % (OUT, data["totals"]["n"], os.path.getsize(OUT) / 1024))


if __name__ == "__main__":
    main()
