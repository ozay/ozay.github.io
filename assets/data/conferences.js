/* ---------------------------------------------------------------------------
   Conferences — two lists that do two different jobs.

   SITE_CONF_SERIES    The recurring meetings themselves: EURO, YAEM, WCTR and
                       the rest. A series is stable. Its name, its rhythm and
                       what it is good for do not change from year to year, so
                       this list stays useful even when nobody has refreshed
                       the dates for a while. This is the part a PhD student
                       asking "where should I send this?" actually needs.

   SITE_CONF_EDITIONS  One particular year of one series: the city, the dates,
                       the deadline, and your part in it. Editions go stale —
                       that is the point of keeping them apart from the series.

   An edition with no `roles` is just a listing: it tells a visitor the meeting
   is happening. Give it roles and it also becomes part of your record, and
   shows up under "Where I'll be" while it is still in the future.

   Past and future are worked out from the dates, the same way talks.js does
   it, so nothing here ever needs taking down.

   ---------------------------------------------------------------------------
   A series:
     key        short id, referenced by an edition's `series`
     name       what it calls itself
     short      acronym, shown in the card's corner
     group      a key of SITE_CONF_GROUPS
     url        the society's or series' home page, not one year's site
     freqEn/Tr  "Annual", "Every three years", …
     whenEn/Tr  the month it usually falls in
     whatEn/Tr  one line: what you would go there for
     noteEn/Tr  optional second line: a caveat, or who it suits
     tags       free text, searched but not displayed
     often      true for the handful closest to your work — these are also
                pinned to the band at the top of the page

   An edition:
     series     a key in SITE_CONF_SERIES
     year       the year, used in the heading
     edition    optional ordinal, e.g. "45th". `editionTr` gives the Turkish
                form ("45."); without it the English one is shown in both.
     city       the city, spelled the same in both languages
     country    `countryTr` gives the Turkish name ("Almanya"); without it
                the English one is shown in both
     date       / dateEnd    "YYYY-MM-DD". Both optional: with no `date` the
                card shows the year alone and sorts by it, which is how to
                list a meeting whose days you have not checked.
     deadline   "YYYY-MM-DD" — the abstract or paper deadline. Leave it out
                unless you have checked it. A deadline in the past drops out
                of "Open calls" by itself; a wrong one is worse than none.
                While the call is open the edition sits under "Open calls" and
                nowhere else; once the deadline passes it moves down to
                "Coming up" on its own.
     url        that year's own site
     roles      array of keys in SITE_CONF_ROLES. Omit for a plain listing.
     talk       optional: the `date` of an entry in talks.js, which puts that
                talk's slide link on this card
     noteEn/Tr  optional one line
--------------------------------------------------------------------------- */

/* The date the deadlines and links below were last checked. Shown on the page:
   a directory that does not say when it was last looked at is worth nothing. */
window.SITE_CONF_CHECKED = "2026-11-04";

/* Ordered loosely by weight — the first match in an edition's `roles` is the
   one the card leads with. */
window.SITE_CONF_ROLES = {
  chair:      { en: "Co-chair",              tr: "Eş başkan" },
  organising: { en: "Organising committee",  tr: "Düzenleme kurulu" },
  scientific: { en: "Scientific committee",  tr: "Bilim kurulu" },
  track:      { en: "Session chair",         tr: "Oturum başkanı" },
  reviewer:   { en: "Reviewer",              tr: "Hakem" },
  speaker:    { en: "Speaker",               tr: "Konuşmacı" },
  attendee:   { en: "Attended",              tr: "Katılımcı" }
};

window.SITE_CONF_GROUPS = {
  turkiye: {
    en: "Türkiye",
    tr: "Türkiye",
    blurbEn: "The national meeting, and the society behind it.",
    blurbTr: "Ulusal kongre ve arkasındaki dernek."
  },
  general: {
    en: "General operational research and industrial engineering",
    tr: "Genel yöneylem araştırması ve endüstri mühendisliği",
    blurbEn: "Broad programmes with a stream for almost anything. Good for a first conference paper, and for finding out who else works on your problem.",
    blurbTr: "Neredeyse her konuya bir oturum ayıran geniş programlar. İlk kongre bildirisi için ve probleminiz üzerine kimlerin çalıştığını görmek için uygun."
  },
  specialist: {
    en: "Method and domain meetings",
    tr: "Yöntem ve alan kongreleri",
    blurbEn: "Smaller rooms, a narrower audience, and people who already know the literature you are citing.",
    blurbTr: "Daha küçük salonlar, daha dar bir kitle ve atıf verdiğiniz literatürü zaten bilen insanlar."
  },
  doctoral: {
    en: "For doctoral students",
    tr: "Doktora öğrencileri için",
    blurbEn: "Not conferences so much as weeks spent with a small group and a few senior people. Selective, cheap once you are in, and worth more than a talk in a parallel session.",
    blurbTr: "Kongreden çok, küçük bir grupla ve birkaç kıdemli araştırmacıyla geçirilen haftalar. Seçici, kabul edildikten sonra ucuz ve paralel oturumdaki bir sunumdan daha değerli."
  }
};

window.SITE_CONF_SERIES = [

  /* ----------------------------------------------------------- Türkiye -- */

  { key: "yaem", short: "YAEM", group: "turkiye", often: true,
    name: "Yöneylem Araştırması ve Endüstri Mühendisliği Kongresi",
    url: "https://www.yad.org.tr/tr/",
    freqEn: "Annual", freqTr: "Yıllık",
    whenEn: "June or July", whenTr: "Haziran veya Temmuz",
    whatEn: "The national congress, hosted by a different Turkish university each year and run under the Operational Research Society of Türkiye. Presentations are mostly in Turkish.",
    whatTr: "Her yıl başka bir Türk üniversitesinin ev sahipliğinde, Yöneylem Araştırması Derneği çatısı altında düzenlenen ulusal kongre. Sunumlar ağırlıkla Türkçe.",
    noteEn: "The obvious first conference for a Turkish doctoral student: a real audience, in your own language, without a travel grant.",
    noteTr: "Türkiyeli bir doktora öğrencisi için ilk akla gelen kongre: gerçek bir dinleyici kitlesi, kendi dilinizde ve seyahat desteği gerektirmeden.",
    tags: "türkiye turkey national ulusal yöneylem endüstri mühendisliği turkish YAD" },

  /* ------------------------------------------------------------ general -- */

  { key: "euro", short: "EURO", group: "general", often: true,
    name: "EURO Conference on Operational Research",
    url: "https://www.euro-online.org",
    freqEn: "Annual", freqTr: "Yıllık",
    whenEn: "Late June or early July", whenTr: "Haziran sonu veya Temmuz başı",
    whatEn: "The conference of the Association of European Operational Research Societies, and the largest OR meeting in Europe. Streams cover the whole field, and the EURO working groups meet around it.",
    whatTr: "Avrupa Yöneylem Araştırması Dernekleri Birliği'nin kongresi ve Avrupa'nın en büyük YA buluşması. Oturumlar alanın tamamını kapsar; EURO çalışma grupları da bu kongre etrafında toplanır.",
    noteEn: "Abstract-only submission, which makes it an easy place to present work that is not finished yet.",
    noteTr: "Yalnızca özet ile başvurulur; bu da henüz tamamlanmamış bir çalışmayı sunmak için elverişli kılar.",
    tags: "europe european avrupa OR operational research EURO-k" },

  { key: "ifors", short: "IFORS", group: "general",
    name: "IFORS Triennial Conference",
    url: "https://www.ifors.org",
    freqEn: "Every three years", freqTr: "Üç yılda bir",
    whenEn: "Usually mid-year", whenTr: "Genellikle yıl ortası",
    whatEn: "The world congress of the International Federation of Operational Research Societies, which rotates between continents.",
    whatTr: "Uluslararası Yöneylem Araştırması Dernekleri Federasyonu'nun kıtalar arasında dönüşümlü düzenlenen dünya kongresi.",
    tags: "world international federation triennial dünya uluslararası" },

  { key: "informs", short: "INFORMS", group: "general",
    name: "INFORMS Annual Meeting",
    url: "https://www.informs.org",
    freqEn: "Annual", freqTr: "Yıllık",
    whenEn: "October or November", whenTr: "Ekim veya Kasım",
    whatEn: "The largest operational research meeting anywhere, in a different US city each autumn, with several thousand talks.",
    whatTr: "Her sonbahar başka bir ABD şehrinde düzenlenen, binlerce sunumun yapıldığı, dünyanın en büyük yöneylem araştırması buluşması.",
    noteEn: "Large enough that it is worth going with a reason — a session to chair, people to meet — rather than only a talk to give.",
    noteTr: "Yalnızca sunum yapmak için değil, bir nedenle gitmeye değecek kadar büyük: yöneteceğiniz bir oturum, görüşeceğiniz insanlar.",
    tags: "united states america INFORMS annual meeting ABD" },

  { key: "poms", short: "POMS", group: "general",
    name: "POMS Annual Conference",
    url: "https://www.poms.org",
    freqEn: "Annual", freqTr: "Yıllık",
    whenEn: "Spring", whenTr: "İlkbahar",
    whatEn: "The Production and Operations Management Society's meeting: operations strategy, supply chains and service operations, closer to management schools than to engineering ones.",
    whatTr: "Üretim ve Operasyon Yönetimi Derneği'nin kongresi: operasyon stratejisi, tedarik zincirleri ve hizmet operasyonları; mühendislik fakültelerinden çok işletme okullarına yakın.",
    tags: "production operations management supply chain üretim operasyon tedarik" },

  { key: "ieom", short: "IEOM", group: "general",
    name: "IEOM Society International Conference",
    url: "https://ieomsociety.org",
    freqEn: "Several a year", freqTr: "Yılda birkaç kez",
    whenEn: "Varies by region", whenTr: "Bölgeye göre",
    whatEn: "Industrial engineering and operations management, with separate European, Middle Eastern, Asian and American meetings, so there is usually one within reach.",
    whatTr: "Endüstri mühendisliği ve operasyon yönetimi; Avrupa, Orta Doğu, Asya ve Amerika için ayrı toplantılar düzenlendiğinden genellikle ulaşılabilir bir tanesi bulunur.",
    tags: "industrial engineering operations management regional endüstri mühendisliği" },

  { key: "icores", short: "ICORES", group: "general",
    name: "International Conference on Operations Research and Enterprise Systems",
    url: "https://icores.org",
    freqEn: "Annual", freqTr: "Yıllık",
    whenEn: "February", whenTr: "Şubat",
    whatEn: "A smaller European meeting with full-paper proceedings and a short turnaround between submission and publication.",
    whatTr: "Tam metin bildiri kitabı olan, başvuru ile yayın arasındaki süre kısa, daha küçük ölçekli bir Avrupa toplantısı.",
    tags: "europe proceedings full paper enterprise systems bildiri" },

  /* --------------------------------------------------------- specialist -- */

  { key: "wctr", short: "WCTR", group: "specialist", often: true,
    name: "World Conference on Transport Research",
    url: "https://wctrs-society.org",
    freqEn: "Every three years", freqTr: "Üç yılda bir",
    whenEn: "Usually July", whenTr: "Genellikle Temmuz",
    whatEn: "The transport research world congress, held seventeen times since 1977. Istanbul hosted the tenth, in 2004.",
    whatTr: "1977'den bu yana on yedi kez düzenlenen ulaştırma araştırmaları dünya kongresi. Onuncusuna 2004'te İstanbul ev sahipliği yaptı.",
    noteEn: "Three years between editions, so a doctoral student gets at most two shots at it.",
    noteTr: "Toplantılar arasında üç yıl var; yani bir doktora öğrencisinin en fazla iki şansı oluyor.",
    tags: "transport transportation ulaştırma taşımacılık WCTRS triennial" },

  { key: "trb", short: "TRB", group: "specialist",
    name: "TRB Annual Meeting",
    url: "https://www.trb.org",
    freqEn: "Annual", freqTr: "Yıllık",
    whenEn: "January", whenTr: "Ocak",
    whatEn: "The Transportation Research Board's meeting in Washington, DC — enormous, policy-facing, and the place US transport agencies go to.",
    whatTr: "Transportation Research Board'un Washington DC'deki toplantısı: çok büyük, politika odaklı ve ABD ulaştırma kurumlarının geldiği yer.",
    noteEn: "Submissions close the summer before, which catches people out.",
    noteTr: "Başvurular bir önceki yaz kapanır; bu çoğu kişiyi hazırlıksız yakalar.",
    tags: "transportation research board washington policy ulaştırma politika" },

  { key: "itf", short: "ITF", group: "specialist", often: true,
    name: "International Transport Forum Summit",
    url: "https://www.itf-oecd.org/itf-summit",
    freqEn: "Annual", freqTr: "Yıllık",
    whenEn: "May", whenTr: "Mayıs",
    whatEn: "The annual summit of the International Transport Forum, the intergovernmental organisation hosted by the OECD, held in Leipzig. Transport ministers from its member countries sit in the same room as industry, international organisations and researchers.",
    whatTr: "OECD bünyesinde yer alan hükümetler arası kuruluş olan Uluslararası Ulaştırma Forumu'nun Leipzig'de yapılan yıllık zirvesi. Üye ülkelerin ulaştırma bakanları; sanayi, uluslararası kuruluşlar ve araştırmacılarla aynı salonda bulunur.",
    noteEn: "A policy summit rather than a paper conference: there is no general academic call for papers. The theme is set each year by the country holding the presidency.",
    noteTr: "Bildiri kongresinden çok bir politika zirvesi: genel bir akademik bildiri çağrısı yok. Tema her yıl dönem başkanlığını yürüten ülke tarafından belirleniyor.",
    tags: "transport policy ministers OECD Leipzig ulaştırma politika bakanlar zirve summit" },

  { key: "tra", short: "TRA", group: "specialist",
    name: "Transport Research Arena",
    url: "https://traconference.eu",
    freqEn: "Every two years", freqTr: "İki yılda bir",
    whenEn: "May", whenTr: "Mayıs",
    whatEn: "Europe's transport research and innovation conference, initiated by the European Commission and covering every mode. Academia, industry, policymakers and civil society share one programme, and the organisers make a point of young researchers.",
    whatTr: "Avrupa Komisyonu'nun öncülüğünde başlatılan, tüm ulaşım türlerini kapsayan Avrupa ulaştırma araştırma ve inovasyon konferansı. Akademi, sanayi, politika yapıcılar ve sivil toplum aynı programı paylaşıyor; düzenleyiciler genç araştırmacılara ayrıca önem veriyor.",
    noteEn: "It moves around Europe — Vienna, Lisbon, Dublin and Budapest in recent editions — and it does have a call for papers, unlike the ITF Summit.",
    noteTr: "Avrupa'da yer değiştiriyor — son toplantıları Viyana, Lizbon, Dublin ve Budapeşte'de yapıldı — ve ITF Zirvesi'nin aksine bildiri çağrısı var.",
    tags: "transport research innovation europe european commission ulaştırma araştırma inovasyon avrupa" },

  { key: "mcdm", short: "MCDM", group: "specialist", often: true,
    name: "International Conference on Multiple Criteria Decision Making",
    url: "https://www.mcdmsociety.org",
    freqEn: "Every two years", freqTr: "İki yılda bir",
    whenEn: "Usually summer", whenTr: "Genellikle yaz",
    whatEn: "The International Society on MCDM's own meeting: outranking, value functions, goal programming and the people who built them.",
    whatTr: "Uluslararası ÇKKV Derneği'nin kendi toplantısı: üstünlük yöntemleri, değer fonksiyonları, hedef programlama ve bunları kuran isimler.",
    tags: "multiple criteria decision making MCDM ÇKKV karar verme outranking" },

  { key: "isahp", short: "ISAHP", group: "specialist", often: true,
    name: "International Symposium on the Analytic Hierarchy Process",
    url: "https://www.isahp.org",
    freqEn: "Every two years", freqTr: "İki yılda bir",
    whenEn: "Varies", whenTr: "Değişken",
    whatEn: "AHP and ANP specifically — a small symposium where methodological objections get argued out properly.",
    whatTr: "Özel olarak AHP ve ANP üzerine; yöntemsel itirazların gerçekten tartışıldığı küçük bir sempozyum.",
    tags: "AHP ANP analytic hierarchy network process Saaty karar" },

  { key: "ispim", short: "ISPIM", group: "specialist",
    name: "ISPIM Innovation Conference",
    url: "https://www.ispim-innovation.com",
    freqEn: "Annual", freqTr: "Yıllık",
    whenEn: "June", whenTr: "Haziran",
    whatEn: "Innovation and technology management, drawing five or six hundred people from academia, industry, consultancy and the public sector.",
    whatTr: "İnovasyon ve teknoloji yönetimi; akademiden, sanayiden, danışmanlıktan ve kamudan beş altı yüz kişiyi bir araya getiriyor.",
    tags: "innovation management technology entrepreneurship inovasyon girişimcilik" },

  { key: "ismp", short: "ISMP", group: "specialist",
    name: "International Symposium on Mathematical Programming",
    url: "https://www.mathopt.org",
    freqEn: "Every three years", freqTr: "Üç yılda bir",
    whenEn: "Summer", whenTr: "Yaz",
    whatEn: "The Mathematical Optimization Society's symposium. Theory first: this is where the methods the rest of us apply are proved.",
    whatTr: "Mathematical Optimization Society'nin sempozyumu. Önce kuram: geri kalanımızın uyguladığı yöntemler burada ispatlanır.",
    noteEn: "Go for the mathematics, not for an application paper.",
    noteTr: "Uygulama bildirisi için değil, matematik için gidilir.",
    tags: "mathematical programming optimization theory optimizasyon kuram" },

  /* ----------------------------------------------------------- doctoral -- */

  { key: "europhd", short: "EURO", group: "doctoral", often: true,
    name: "EURO PhD Schools and Summer Institutes",
    url: "https://www.euro-online.org",
    freqEn: "Several each year", freqTr: "Her yıl birkaç tane",
    whenEn: "Mostly summer", whenTr: "Çoğunlukla yaz",
    whatEn: "A week or two on one topic, with a dozen or so doctoral students and the people who wrote the papers. Applications are competitive and places are few.",
    whatTr: "Tek bir konu üzerine bir iki hafta; on beş kadar doktora öğrencisi ve makaleleri yazan isimlerle birlikte. Başvurular rekabetçi, kontenjan az.",
    noteEn: "If you supervise a doctoral student, this is the thing to push them towards before another parallel-session talk.",
    noteTr: "Bir doktora öğrencisine danışmanlık yapıyorsanız, bir paralel oturum sunumundan önce onu buraya yönlendirin.",
    tags: "phd doctoral school summer institute students doktora okul yaz öğrenci" }
];

/* ---------------------------------------------------------------------------
   Editions. Only what is actually confirmed is listed here.

   Özay: this is the half of the page I could not write for you. Send me the
   conferences you have organised or sat on a committee for — which ones, which
   years, which role — and the ones you attended, and they go in here. Until
   then the page runs on the two entries below, both of which come from
   elsewhere on this site rather than from guesswork.
--------------------------------------------------------------------------- */
window.SITE_CONF_EDITIONS = [

  { series: "yaem", year: 2026, edition: "45th", editionTr: "45.",
    city: "İstanbul", country: "Türkiye",
    date: "2026-06-29", dateEnd: "2026-07-01",
    roles: ["speaker"],
    talk: "2026-06-29" },

  { series: "isahp", year: 2027, edition: "19th", editionTr: "19.",
    city: "İstanbul", country: "Türkiye",
    date: "2027-05-31", dateEnd: "2027-06-02",
    deadline: "2027-02-15",
    url: "https://isahp.org/isahp",
    roles: ["chair"],
    noteEn: "Theme: sustainable decisions for a complex future. At Istanbul Technical University, Maçka campus.",
    noteTr: "Tema: karmaşık bir gelecek için sürdürülebilir kararlar. İstanbul Teknik Üniversitesi Maçka yerleşkesinde." },

  /* Özay attended both of these. Themes are from the ITF's own summit
     material; the venue is the Congress Center Leipzig, as every year. */
  { series: "itf", year: 2026,
    city: "Leipzig", country: "Germany", countryTr: "Almanya",
    date: "2026-05-06", dateEnd: "2026-05-08",
    roles: ["attendee"],
    noteEn: "Theme: funding resilient transport, under the presidency of Azerbaijan.",
    noteTr: "Tema: dayanıklı ulaştırmanın finansmanı; Azerbaycan dönem başkanlığında." },

  { series: "itf", year: 2025,
    city: "Leipzig", country: "Germany", countryTr: "Almanya",
    date: "2025-05-21", dateEnd: "2025-05-23",
    roles: ["attendee"],
    noteEn: "Theme: transport resilience to global shocks — the first of a three-year run on resilience.",
    noteTr: "Tema: küresel şoklara karşı ulaştırmada dayanıklılık — dayanıklılık üzerine üç yıllık dizinin ilki." },

  /* Announced as the third of that run. No dates published yet, so no `date`:
     the card shows the year alone. Leipzig is the standing venue. */
  { series: "itf", year: 2027,
    city: "Leipzig", country: "Germany", countryTr: "Almanya",
    noteEn: "The last of the three summits on resilience.",
    noteTr: "Dayanıklılık üzerine üç zirvenin sonuncusu." },

  /* From the WCTR map on this site, which records years and cities but not
     days. No `date`, so the card shows the year alone — see the note on
     `date` above. No role claimed: this is a listing, not a claim that
     anyone went. Only upcoming editions are shown, so there is no point
     listing past ones unless you were there and give them a role. */
  { series: "wctr", year: 2029, edition: "18th", editionTr: "18.",
    city: "Brisbane", country: "Australia", countryTr: "Avustralya" }

  /* A full example, for when you add the real ones:

  { series: "euro", year: 2027, edition: "33rd",
    city: "Rome", country: "Italy", countryTr: "İtalya",
    date: "2027-07-04", dateEnd: "2027-07-07",
    deadline: "2027-03-01",
    url: "https://euro2027.example.org",
    roles: ["organising", "track"],
    noteEn: "Chaired the decision analysis stream.",
    noteTr: "Karar analizi akışının oturum başkanlığı." },
  */
];
