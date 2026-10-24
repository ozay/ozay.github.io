/* ---------------------------------------------------------------------------
   Research funding, calls and partner institutes — the places worth checking
   before writing a proposal.

   SITE_FUNDING_KINDS   the badge on each card. Not everything here hands out
                        money: a "portal" is where calls are listed, an
                        "institute" is a partner you apply *with*, not *to*.
   SITE_FUNDING_GROUPS  the sections of the page, in the order shown.
   SITE_FUNDING         one entry per organisation.

   Each entry:
     name     what it is called, as it calls itself
     short    the acronym or shelf label; shown in the card's corner
     url      where the link goes
     kind     a key of SITE_FUNDING_KINDS
     group    a key of SITE_FUNDING_GROUPS
     whatEn   / whatTr   one line: what you would actually go there for
     noteEn   / noteTr   optional second line: a caveat worth remembering
     often    true for the handful checked regularly — these also appear,
              pinned, in the band at the top of the page
     tags     free-text, searched but not displayed
--------------------------------------------------------------------------- */

window.SITE_FUNDING_KINDS = {
  funder:    { en: "Funder",    tr: "Fon sağlayıcı" },
  portal:    { en: "Call portal", tr: "Çağrı portalı" },
  institute: { en: "Partner institute", tr: "Ortak kurum" }
};

window.SITE_FUNDING_GROUPS = {
  turkiye: {
    en: "Türkiye",
    tr: "Türkiye",
    blurbEn: "National and local money, and the research office two buildings away.",
    blurbTr: "Ulusal ve yerel kaynaklar, bir de iki bina ötedeki araştırma ofisi."
  },
  europe: {
    en: "European Union",
    tr: "Avrupa Birliği",
    blurbEn: "Türkiye is an associated country to Horizon Europe and a full COST member, so these are open to apply to from Istanbul.",
    blurbTr: "Türkiye, Ufuk Avrupa'ya asosiye ülke ve COST'a tam üye; dolayısıyla bunların tamamına İstanbul'dan başvurulabilir."
  },
  bilateral: {
    en: "National agencies abroad",
    tr: "Yurt dışındaki ulusal ajanslar"
  },
  institutes: {
    en: "Partner institutes",
    tr: "Ortak kurumlar",
    blurbEn: "Not funders. Places to find a co-applicant, or to visit.",
    blurbTr: "Fon sağlayıcı değiller. Ortak başvurucu bulunacak ya da ziyaret edilecek yerler."
  }
};

window.SITE_FUNDING = [

  /* ------------------------------------------------------- checked often -- */

  { name: "HK-dir", short: "Norway",
    url: "https://hkdir.no/en",
    kind: "funder", group: "bilateral", often: true,
    whatEn: "Norwegian Directorate for Higher Education and Skills — institutional partnerships, mobility and joint programmes with Norwegian universities.",
    whatTr: "Norveç Yükseköğretim ve Beceriler Direktörlüğü — Norveç üniversiteleriyle kurumsal ortaklıklar, hareketlilik ve ortak programlar.",
    noteEn: "Formerly Diku, which merged into HK-dir in 2021; diku.no now redirects here.",
    noteTr: "Eskiden Diku'ydu, 2021'de HK-dir'e katıldı; diku.no artık buraya yönleniyor.",
    tags: "diku norway norge mobility partnership utdanning" },

  { name: "Türkiye Ulusal Ajansı", short: "Erasmus+",
    url: "https://www.ua.gov.tr/en",
    kind: "funder", group: "turkiye", often: true,
    whatEn: "Turkish National Agency — Erasmus+ staff and student mobility, cooperation partnerships, and the European Solidarity Corps.",
    whatTr: "Türkiye Ulusal Ajansı — Erasmus+ personel ve öğrenci hareketliliği, iş birliği ortaklıkları ve Avrupa Dayanışma Programı.",
    tags: "erasmus mobility ka171 ka220 solidarity ulusal ajans" },

  { name: "Fraunhofer IAIS", short: "Germany",
    url: "https://www.iais.fraunhofer.de/en.html",
    kind: "institute", group: "institutes", often: true,
    whatEn: "Institute for Intelligent Analysis and Information Systems — applied AI and machine learning, and a plausible German partner on a Horizon consortium.",
    whatTr: "Akıllı Analiz ve Bilgi Sistemleri Enstitüsü — uygulamalı yapay zekâ ve makine öğrenmesi; Ufuk Avrupa konsorsiyumunda olası bir Alman ortak.",
    noteEn: "A research institute, not a funding body — you apply with them, not to them.",
    noteTr: "Fon sağlayıcı değil, bir araştırma enstitüsü — buraya değil, bunlarla birlikte başvurulur.",
    tags: "fraunhofer ai machine learning sankt augustin germany consortium" },

  /* -------------------------------------------------------------- Türkiye -- */

  { name: "TÜBİTAK", short: "TR",
    url: "https://tubitak.gov.tr/en",
    kind: "funder", group: "turkiye",
    whatEn: "The national research council. ARDEB academic grants, the 2232 international fellowships, and the bilateral calls run with DAAD, CNPq, NCBR and others.",
    whatTr: "Ulusal araştırma kurumu. ARDEB akademik destekleri, 2232 uluslararası burslar ve DAAD, CNPq, NCBR gibi kurumlarla yürütülen ikili çağrılar.",
    tags: "tubitak ardeb 1001 1002 2232 bideb teydeb bilateral" },

  { name: "TÜBİTAK funding programmes", short: "Calls",
    url: "https://tubitak.gov.tr/en/funds",
    kind: "portal", group: "turkiye",
    whatEn: "The programme index itself — every open ARDEB, BİDEB and international call in one list, which is faster than the news page.",
    whatTr: "Program dizini — açık olan tüm ARDEB, BİDEB ve uluslararası çağrılar tek listede; haber sayfasından daha hızlı.",
    tags: "calls open deadlines programmes cagri destek" },

  { name: "TÜBA", short: "TR",
    url: "https://www.tuba.gov.tr/en",
    kind: "funder", group: "turkiye",
    whatEn: "Turkish Academy of Sciences — the GEBİP young-investigator award, TESEP for scholarly publishing, and visiting-scholar support.",
    whatTr: "Türkiye Bilimler Akademisi — GEBİP genç araştırmacı ödülü, bilimsel telif için TEÇEP ve misafir araştırmacı destekleri.",
    tags: "tuba academy gebip tesep award odul" },

  { name: "İstanbul Kalkınma Ajansı", short: "İSTKA",
    url: "https://www.istka.org.tr/",
    kind: "funder", group: "turkiye",
    whatEn: "Istanbul Development Agency — regional calls that suit applied, city-scale work: mobility, logistics, smart-city pilots.",
    whatTr: "İstanbul Kalkınma Ajansı — uygulamalı, kent ölçekli çalışmalara uygun bölgesel çağrılar: hareketlilik, lojistik, akıllı şehir pilotları.",
    noteEn: "Calls are announced in Turkish and run on short windows; worth a monthly look rather than an annual one.",
    noteTr: "Çağrılar Türkçe duyuruluyor ve kısa süreli açılıyor; yılda bir değil ayda bir bakmakta fayda var.",
    tags: "istka istanbul regional kalkinma smart city mali destek" },

  { name: "İÜC Bilimsel Araştırma Projeleri", short: "BAP",
    url: "https://bap.iuc.edu.tr/",
    kind: "funder", group: "turkiye",
    whatEn: "Your own university's internal research fund — the smallest administrative load of anything on this page, and the usual source of seed money and conference travel.",
    whatTr: "Kendi üniversitenizin iç araştırma fonu — bu sayfadaki en az idari yüke sahip kaynak; başlangıç desteği ve kongre yolluğunun olağan adresi.",
    tags: "bap iuc cerrahpasa internal seed travel kongre" },

  /* ------------------------------------------------------------ EU / Europe -- */

  { name: "EU Funding & Tenders Portal", short: "EU",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals",
    kind: "portal", group: "europe",
    whatEn: "Where every EU call actually lives, and where proposals are submitted. Filter by programme and deadline; the partner-search tab finds consortia already forming.",
    whatTr: "Tüm AB çağrılarının gerçekte bulunduğu ve başvuruların yapıldığı yer. Program ve son tarihe göre filtreleyin; ortak arama sekmesi kurulmakta olan konsorsiyumları gösterir.",
    noteEn: "Bookmark this rather than the Horizon Europe brochure pages — it is the one that is current.",
    noteTr: "Ufuk Avrupa tanıtım sayfaları yerine burayı kaydedin — güncel olan bu.",
    tags: "sedia participant portal submission consortium partner search tenders" },

  { name: "Horizon Europe", short: "EU",
    url: "https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en",
    kind: "funder", group: "europe",
    whatEn: "The framework programme. Cluster 5 — climate, energy and mobility — is the one that matches the transportation and SDG work most directly.",
    whatTr: "Çerçeve programı. Küme 5 — iklim, enerji ve hareketlilik — ulaştırma ve SKA çalışmalarıyla en doğrudan örtüşen başlık.",
    tags: "horizon europe cluster 5 mobility climate framework ufuk avrupa" },

  { name: "Marie Skłodowska-Curie Actions", short: "MSCA",
    url: "https://marie-sklodowska-curie-actions.ec.europa.eu/",
    kind: "funder", group: "europe",
    whatEn: "Fellowships and doctoral networks. Staff Exchanges in particular suit a lab that already has partners in Norway and Germany.",
    whatTr: "Burslar ve doktora ağları. Özellikle Personel Değişimi, Norveç ve Almanya'da hâlihazırda ortağı olan bir ekibe uygun.",
    tags: "msca postdoctoral fellowship doctoral network staff exchanges se dn pf" },

  { name: "European Research Council", short: "ERC",
    url: "https://erc.europa.eu/homepage",
    kind: "funder", group: "europe",
    whatEn: "Frontier research grants to one principal investigator. Large, single-PI, and judged on the idea rather than the consortium.",
    whatTr: "Tek bir yürütücüye verilen öncü araştırma destekleri. Büyük, tek yürütücülü ve konsorsiyuma değil fikre göre değerlendirilen.",
    tags: "erc starting consolidator advanced synergy frontier pi" },

  { name: "COST", short: "EU",
    url: "https://www.cost.eu/",
    kind: "funder", group: "europe",
    whatEn: "Funds networks rather than research: meetings, short visits, training schools. The cheapest way into a European consortium, and Türkiye is a full member.",
    whatTr: "Araştırmayı değil ağları finanse eder: toplantılar, kısa ziyaretler, eğitim okulları. Avrupa konsorsiyumuna girmenin en ucuz yolu ve Türkiye tam üye.",
    noteEn: "A running Action can be joined mid-stream — you do not have to wait for the annual call.",
    noteTr: "Devam eden bir Eylem'e sonradan katılmak mümkün — yıllık çağrıyı beklemek gerekmiyor.",
    tags: "cost action networking stsm training school wg" },

  /* -------------------------------------------- national agencies abroad -- */

  { name: "Research Council of Norway", short: "Norway",
    url: "https://www.forskningsradet.no/en/",
    kind: "funder", group: "bilateral",
    whatEn: "Forskningsrådet — the Norwegian research council. Most calls need a Norwegian host, so this pairs with an HK-dir partnership rather than standing alone.",
    whatTr: "Forskningsrådet — Norveç araştırma konseyi. Çoğu çağrı Norveçli bir ev sahibi gerektirir; tek başına değil, HK-dir ortaklığıyla birlikte düşünülmeli.",
    tags: "forskningsradet norway rcn norge" },

  { name: "EEA and Norway Grants", short: "EEA",
    url: "https://eeagrants.org/en/fmo",
    kind: "funder", group: "bilateral",
    whatEn: "Iceland, Liechtenstein and Norway funding cooperation across Europe, with research and education among the programme areas.",
    whatTr: "İzlanda, Lihtenştayn ve Norveç'in Avrupa genelinde finanse ettiği iş birlikleri; program alanları arasında araştırma ve eğitim de var.",
    noteEn: "Beneficiary states are set per funding period — check that Türkiye is in the current one before investing time.",
    noteTr: "Yararlanıcı ülkeler her dönem için belirleniyor — vakit ayırmadan önce Türkiye'nin güncel listede olup olmadığına bakın.",
    tags: "eea norway grants iceland liechtenstein fmo" },

  { name: "DAAD", short: "Germany",
    url: "https://www.daad.de/en/",
    kind: "funder", group: "bilateral",
    whatEn: "German Academic Exchange Service — research stays, university partnerships, and the joint exchange call it runs with TÜBİTAK.",
    whatTr: "Alman Akademik Değişim Servisi — araştırma ziyaretleri, üniversite ortaklıkları ve TÜBİTAK'la yürüttüğü ortak değişim çağrısı.",
    tags: "daad germany exchange research stay tubitak joint" },

  { name: "Alexander von Humboldt Foundation", short: "Germany",
    url: "https://www.humboldt-foundation.de/en/",
    kind: "funder", group: "bilateral",
    whatEn: "Experienced-researcher fellowships in Germany, awarded on track record with no quota by country and no fixed deadline.",
    whatTr: "Almanya'da deneyimli araştırmacı bursları; ülke kotası ve sabit son tarih olmadan, akademik geçmişe göre veriliyor.",
    tags: "humboldt fellowship germany experienced researcher" },

  { name: "DFG", short: "Germany",
    url: "https://www.dfg.de/en",
    kind: "funder", group: "bilateral",
    whatEn: "Deutsche Forschungsgemeinschaft — German research grants, reachable through a German co-applicant on a joint project.",
    whatTr: "Deutsche Forschungsgemeinschaft — Alman araştırma destekleri; ortak projede Alman bir eş-başvurucu üzerinden erişilebilir.",
    tags: "dfg germany forschungsgemeinschaft joint project" },

  { name: "Fulbright Türkiye", short: "USA",
    url: "https://fulbright.org.tr/",
    kind: "funder", group: "bilateral",
    whatEn: "Visiting scholar and lecturing grants in the United States, administered in Ankara with one annual cycle.",
    whatTr: "Amerika Birleşik Devletleri'nde misafir araştırmacı ve ders verme bursları; Ankara'dan yürütülüyor, yılda tek dönem.",
    tags: "fulbright usa visiting scholar lecturing ankara" }

];
