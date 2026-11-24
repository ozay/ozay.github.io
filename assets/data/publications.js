/* ---------------------------------------------------------------------------
   Publications. Add a new entry at the top of the array.
   topic  -> one of the keys in SITE_TOPICS below (drives colour + filters)
   tags   -> free-form keywords, used by the search box
   doi    -> optional; when present the card shows a DOI button
   link   -> optional extra button, e.g. a slide deck or a dataset:
             { href: "talks/2026-bsec-kapikule/", labelEn: "Slide deck", labelTr: "Sunum" }
--------------------------------------------------------------------------- */

window.SITE_TOPICS = {
  transport:    { en: "Transportation & Logistics", tr: "Ulaştırma ve Lojistik" },
  sustain:      { en: "Sustainability",             tr: "Sürdürülebilirlik" },
  trade:        { en: "Trade & Policy",             tr: "Ticaret ve Politika" },
  industry:     { en: "Industry & Competitiveness", tr: "Sanayi ve Rekabetçilik" },
  decision:     { en: "Decision Science & OR",      tr: "Karar Bilimi ve YA" },
  innovation:   { en: "Innovation & Smart Cities",  tr: "İnovasyon ve Akıllı Şehirler" }
};

window.SITE_PUBLICATIONS = [
  {
    year: 2026,
    title: "Interaction of Sustainable Development Goals from an Environmental Perspective",
    authors: ["Özgür Kabak", "Şule Önsel Ekici", "Özay Özaydın", "Füsun Ülengin", "Y. İlker Topçu"],
    venue: "Environmental Modelling & Software",
    artno: "106999",
    topic: "sustain",
    tags: ["SDG", "environment", "systems", "interaction", "modelling"],
    doi: ""
  },
  {
    year: 2026,
    title: "Value propositions in smart city business models: An analytical framework based on the smart cities wheel",
    authors: ["Özay Özaydın", "Hakan Acar"],
    venue: "International Journal of Urban Sciences",
    pages: "1–19",
    topic: "innovation",
    tags: ["smart city", "business model", "value proposition", "framework"],
    doi: ""
  },
  {
    year: 2025,
    title: "A decision model for enhancing reaction yield: Pd(II) and Pt(II) metal insertion to free porphyrin",
    authors: ["Özay Özaydın", "Emel Önal"],
    venue: "Turkish Journal of Chemistry",
    volume: "49", issue: "4", pages: "450–459",
    topic: "decision",
    tags: ["chemistry", "yield", "decision model", "experimental design"],
    doi: ""
  },
  {
    year: 2025,
    title: "Analysis of direct and indirect relations among sustainable development goals and transportation targets",
    authors: ["Özay Özaydın", "Özgür Kabak", "Y. İlker Topçu", "Füsun Ülengin", "Şule Önsel Ekici"],
    venue: "Transport Policy",
    volume: "171", pages: "270–281",
    topic: "sustain",
    tags: ["SDG", "transportation", "DEMATEL", "policy"],
    doi: ""
  },
  {
    year: 2021,
    title: "A simulation-based approach for improving the largest border crossing between Europe and Turkey",
    authors: ["Füsun Ülengin", "Bora Çekyay", "Mine Işık", "Özay Özaydın", "Özgür Kabak", "Peral Toktaş-Palut", "Şule Önsel Ekici", "Y. İlker Topçu"],
    venue: "Transport Policy",
    volume: "114", pages: "350–363",
    topic: "transport",
    tags: ["simulation", "border crossing", "Kapıkule", "queueing"],
    doi: "",
    link: { href: "talks/2026-bsec-kapikule/", labelEn: "Slide deck", labelTr: "Sunum" }
  },
  {
    year: 2020,
    title: "A multi-commodity network flow and gravity model integration for analyzing impact of road transport quotas on international trade",
    authors: ["Bora Çekyay", "Özgür Kabak", "Füsun Ülengin", "Burç Ülengin", "Peral Toktaş-Palut", "Özay Özaydın"],
    venue: "Research in Transportation Economics",
    volume: "80", artno: "100816",
    topic: "trade",
    tags: ["network flow", "gravity model", "quota", "road transport"],
    doi: ""
  },
  {
    year: 2018,
    title: "Policy developments for the reduction of climate change impacts by the transportation sector",
    authors: ["Füsun Ülengin", "Mine Işık", "Şule Önsel Ekici", "Özay Özaydın", "Özgür Kabak", "Y. İlker Topçu"],
    venue: "Transport Policy",
    volume: "61", pages: "36–50",
    topic: "sustain",
    tags: ["climate change", "emissions", "policy", "transportation"],
    doi: ""
  },
  {
    year: 2017,
    title: "Analysis of the impact of bilateral and transit quotas on Turkey's international trade by road transport: An integrated maximum flow and gravity model approach",
    authors: ["Bora Çekyay", "Peral Toktaş-Palut", "Özgür Kabak", "Füsun Ülengin", "Özay Özaydın", "Burç Ülengin"],
    venue: "Research in Transportation Economics",
    volume: "66", pages: "70–77",
    topic: "trade",
    tags: ["maximum flow", "gravity model", "quota", "foreign trade"],
    doi: ""
  },
  {
    year: 2016,
    title: "Critical Success Factors for the Iron and Steel Industry in Turkey: A Fuzzy DEMATEL Approach",
    authors: ["Özgür Kabak", "Füsun Ülengin", "Bora Çekyay", "Şule Önsel Ekici", "Özay Özaydın"],
    venue: "International Journal of Fuzzy Systems",
    volume: "18", issue: "3", pages: "523–536",
    topic: "industry",
    tags: ["fuzzy DEMATEL", "iron and steel", "critical success factors"],
    doi: ""
  },
  {
    year: 2015,
    title: "Effects of quotas on Turkish foreign trade: A gravity model",
    authors: ["Füsun Ülengin", "Bora Çekyay", "Peral Toktaş-Palut", "Burç Ülengin", "Özgür Kabak", "Özay Özaydın", "Şule Önsel Ekici"],
    venue: "Transport Policy",
    volume: "38", pages: "1–7",
    topic: "trade",
    tags: ["gravity model", "quota", "foreign trade", "econometrics"],
    doi: ""
  },
  {
    year: 2014,
    title: "Cumulative belief degrees approach for analyzing the competitiveness of the automotive industry",
    authors: ["Özgür Kabak", "Füsun Ülengin", "Şule Önsel Ekici", "Özay Özaydın", "Emel Aktaş"],
    venue: "Knowledge-Based Systems",
    volume: "70", pages: "15–25",
    topic: "industry",
    tags: ["cumulative belief degrees", "automotive", "competitiveness"],
    doi: ""
  },
  {
    year: 2014,
    title: "A decision support methodology to enhance the competitiveness of the Turkish automotive industry",
    authors: ["Füsun Ülengin", "Şule Önsel Ekici", "Emel Aktaş", "Özgür Kabak", "Özay Özaydın"],
    venue: "European Journal of Operational Research",
    volume: "234", pages: "789–801",
    topic: "industry",
    tags: ["decision support", "automotive", "competitiveness", "scenario"],
    doi: ""
  },
  {
    year: 2013,
    title: "Are road transportation investments in line with demand projections? A gravity-based analysis for Turkey",
    authors: ["Füsun Ülengin", "Özay Özaydın", "Burç Ülengin", "Andreas Kopp", "Şule Önsel Ekici", "Özgür Kabak", "Emel Aktaş"],
    venue: "Transport Policy",
    volume: "29", pages: "227–235",
    topic: "transport",
    tags: ["investment", "demand projection", "gravity model", "road"],
    doi: ""
  },
  {
    year: 2013,
    title: "Optimizing Fire Station Locations for the Istanbul Metropolitan Municipality",
    authors: ["Emel Aktaş", "Özay Özaydın", "Burçin Bozkaya", "Füsun Ülengin", "Şule Önsel Ekici"],
    venue: "Interfaces (now INFORMS Journal on Applied Analytics)",
    volume: "43", issue: "3", pages: "240–255",
    topic: "decision",
    tags: ["facility location", "emergency services", "Istanbul", "GIS", "optimization"],
    doi: ""
  }
];

/* ---------------------------------------------------------------------------
   Work published inside a book: chapters below, conference papers after them.
   Both are separate from SITE_PUBLICATIONS, because the figures and the
   headline on research.html count journal articles. Newest first.

   editors / book / publisher          -> the venue line and the copied citation
   volume / issue / pages / artno      -> as on a journal entry; Site.bib turns
                                          them into "Volume 4, Pages 156–163"
                                          or "Cilt 4, Sayfa 156–163"
   series                              -> optional, shown after the book title
   event                               -> conference papers only: { en, tr }
   link                                -> optional extra button, e.g. an open-
                                          access PDF
--------------------------------------------------------------------------- */

window.SITE_CHAPTERS = [
  {
    year: 2026,
    title: "Analyzing the role of entrepreneurial ventures in the defense sector: A quantitative study on global and Turkish trends",
    authors: ["Özay Özaydın"],
    editors: ["H. O. Yeloğlu", "B. Mrugalska", "Y. T. İç"],
    book: "Engineering Innovation Nexus: Technology and R&D Management",
    publisher: "Routledge",
    pages: "125–134",
    topic: "industry",
    tags: ["entrepreneurship", "defence industry", "Türkiye", "trends"],
    doi: "10.1201/9781003734802-14"
  }
];

window.SITE_CONFERENCE_PAPERS = [
  {
    year: 2026,
    title: "Smart and Green Logistics: Harnessing Digital Innovation for Maritime Decarbonization in Türkiye",
    authors: ["Fatma Talya Temizceri", "Serkan Karakaş", "Özay Özaydın", "A. Zafer Acar"],
    editors: ["D. Esztergár-Kiss", "A. Munkácsy", "Á. Török"],
    book: "Re-Generation in Transport: Proceedings of the 11th TRA Conference, 2026, Budapest, Hungary",
    series: "Lecture Notes in Mobility",
    publisher: "Springer Nature Switzerland",
    volume: "4",
    pages: "156–163",
    event: {
      en: "Transport Research Arena (TRA) 2026 · Budapest, 18–21 May 2026",
      tr: "Transport Research Arena (TRA) 2026 · Budapeşte, 18–21 Mayıs 2026"
    },
    topic: "transport",
    tags: ["maritime", "decarbonisation", "digitalisation", "ports"],
    openAccess: true,
    doi: "10.1007/978-3-032-36095-3_20",
    link: {
      href: "https://link.springer.com/content/pdf/10.1007/978-3-032-36095-3_20.pdf",
      labelEn: "PDF", labelTr: "PDF"
    }
  }
];
