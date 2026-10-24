/* ---------------------------------------------------------------------------
   Talks and lecture slides. Add a new talk at the TOP of SITE_TALKS.

   date / dateEnd -> "YYYY-MM-DD". A talk dated in the future shows as
                     "Upcoming" on the Talks page and on the home page, and moves
                     to the past list by itself once the day has gone.
                     Give dateEnd for a multi-day event when the exact day of
                     the talk is not known.
   type           -> key in SITE_TALK_TYPES
   lang           -> "en" | "tr": the language the talk was given in. Its title
                     in that language is the original; the other is a translation.
   slides         -> path to the deck, if it is on this site
   pdf / video    -> optional links
   paper          -> optional: the title of a publication in publications.js;
                     the card links to it on the Research page
   with           -> optional co-presenters or co-authors
--------------------------------------------------------------------------- */

window.SITE_TALK_TYPES = {
  conference: { en: "Conference",    tr: "Kongre" },
  meeting:    { en: "Working group", tr: "Çalışma grubu" },
  invited:    { en: "Invited talk",  tr: "Davetli konuşma" },
  seminar:    { en: "Seminar",       tr: "Seminer" }
};

window.SITE_TALKS = [
  {
    date: "2026-09-23",
    type: "meeting",
    lang: "en",
    titleEn: "Improving border-crossing efficiency and reducing waiting times",
    titleTr: "Sınır geçiş verimliliğinin artırılması ve bekleme sürelerinin azaltılması",
    subtitleEn: "A simulation-based case study on the Kapıkule border crossing",
    subtitleTr: "Kapıkule sınır kapısı üzerine simülasyon tabanlı bir vaka çalışması",
    event: "BSEC-URTA Digitalisation Working Group",
    city: "",
    with: ["Füsun Ülengin", "Bora Çekyay", "Mine Işık", "Özgür Kabak", "Peral Toktaş-Palut", "Şule Önsel Ekici", "Y. İlker Topçu"],
    slides: "talks/2026-bsec-kapikule/",
    paper: "A simulation-based approach for improving the largest border crossing between Europe and Turkey"
  },
  {
    // the congress ran 29 June – 1 July; replace with the day of the talk if you have it
    date: "2026-06-29",
    dateEnd: "2026-07-01",
    type: "conference",
    lang: "tr",
    titleTr: "Fotodinamik terapi için yüksek tekli oksijen üreten fotosensitizer yapılarının tahminine yönelik makine öğrenmesi temelli bir çalışma",
    titleEn: "A machine-learning approach to predicting photosensitizer structures with high singlet-oxygen yield for photodynamic therapy",
    eventEn: "YAEM 2026 · 45th Operational Research and Industrial Engineering Congress",
    eventTr: "YAEM 2026 · 45. Yöneylem Araştırması ve Endüstri Mühendisliği Kongresi",
    city: "İstanbul",
    with: ["Emel Önal"],
    slides: "talks/2026-yaem-photosensitizer/"
  }
];

/* Lecture decks, grouped by course on the Talks page and linked from the
   course's card on the Teaching page. `course` must match a title in courses.js. */
window.SITE_LECTURES = [
  {
    code: "ENMU2050",
    course: "Multivariate Functions and Applications",
    term: "2026-2027 Fall",
    week: 1,
    lang: "en",
    titleEn: "Vectors and the dot product",
    titleTr: "Vektörler ve iç çarpım",
    slides: "courses/enmu2050/week-01/"
  }
];
