/* ---------------------------------------------------------------------------
   Everything that is "about you" in one place: identity, links, supervised
   theses and the career timeline.
--------------------------------------------------------------------------- */

window.SITE_PROFILE = {
  name: "Özay Özaydın",
  roleEn: "Assistant Professor of Industrial Engineering",
  roleTr: "Endüstri Mühendisliği Doktor Öğretim Üyesi",
  affiliationEn: "Istanbul University-Cerrahpaşa",
  affiliationTr: "İstanbul Üniversitesi-Cerrahpaşa",
  email: "ozay.ozaydin@iuc.edu.tr",
  phone: "+90 (212) 404 03 00",
  addressEn: "Istanbul University-Cerrahpaşa, Üniversite Mah., Üniversite Cad., 34320 Avcılar / İstanbul, Türkiye",
  addressTr: "İstanbul Üniversitesi-Cerrahpaşa, Üniversite Mah., Üniversite Cad., 34320 Avcılar / İstanbul, Türkiye",
  orcid: "0000-0002-2202-8923",
  scopus: "55812182900",
  teachingSince: 2012,
  links: {
    x:        "https://x.com/ozay",
    linkedin: "https://linkedin.com/in/ozay",
    github:   "https://github.com/ozay",
    instagram:"https://instagram.com/ozay",
    reddit:   "https://www.reddit.com/user/ozidor/",
    facebook: "https://facebook.com/ozay",
    orcid:    "https://orcid.org/0000-0002-2202-8923",
    scopus:   "https://www.scopus.com/authid/detail.uri?authorId=55812182900",
    scholar:  "https://scholar.google.com/citations?user=&hl=en"
  }
};

window.SITE_THESES = [
  { student: "Elissar Abdulhadi", year: 2025, uni: "Bahçeşehir University", degree: "MSc", lang: "English", id: "928833",
    title: "The impact of financial and governmental constraints on SDG implementation in the Lebanese private sector – a case study of Holdal",
    titleTr: "Lübnan özel sektöründe sürdürülebilir kalkınma amaçlarının uygulanmasına mali ve hükümetsel kısıtlamaların etkisi",
    field: "Business Administration", tags: ["SDG", "sustainability", "private sector"] },

  { student: "Assil Abdulhadi", year: 2023, uni: "Bahçeşehir University", degree: "MSc", lang: "English", id: "852964",
    title: "The adoption of bio-innovation by start-ups toward sustainability",
    titleTr: "Bio-yeniliklerin girişimciler tarafından sürdürülebilirliğe doğru benimsenmesi",
    field: "Biotechnology", tags: ["bio-innovation", "start-ups", "sustainability"] },

  { student: "Muteber Ahsen Ateş", year: 2022, uni: "Doğuş University", degree: "MSc", lang: "Turkish", id: "752572",
    title: "Developing team planning management for an inspection organisation",
    titleTr: "Ekip planlama yönetiminin bir muayene kuruluşu için geliştirilmesi",
    field: "Engineering Sciences", tags: ["scheduling", "planning", "assignment"] },

  { student: "Mohammad Abusanad", year: 2022, uni: "Bahçeşehir University", degree: "MSc", lang: "English", id: "731868",
    title: "Investigating the effects of Industry 4.0 on education and entrepreneurial ecosystems",
    titleTr: "Endüstri 4.0'ın eğitim ve girişimcilik ekosistemleri üzerine etkilerinin incelenmesi",
    field: "Business Administration", tags: ["Industry 4.0", "education", "ecosystem"] },

  { student: "Karim M. K. Abualola", year: 2022, uni: "Bahçeşehir University", degree: "MSc", lang: "English", id: "759117",
    title: "Design of a proposed model for an investment digital platform as an input to building entrepreneurial organisations",
    titleTr: "Girişimcilik kuruluşlarına girdi olarak bir yatırım dijital platformunun önerilen bir modelinin tasarımı",
    field: "Business Administration", tags: ["digital platform", "investment", "entrepreneurship"] },

  { student: "Rana Aqeel Akhtar", year: 2021, uni: "Bahçeşehir University", degree: "MSc", lang: "English", id: "741688",
    title: "Impact of customer experience innovation on growth of a luxury retail fashion company",
    titleTr: "Müşteri deneyimi inovasyonunun lüks perakende moda şirketinin büyümesine etkisi",
    field: "Business Administration", tags: ["customer experience", "innovation", "retail"] },

  { student: "Hakan Acar", year: 2019, uni: "Bahçeşehir University", degree: "MSc", lang: "Turkish", id: "573617",
    title: "The relationships between implemented business models and value propositions within smart city solutions",
    titleTr: "Akıllı şehir çözümleri uygulamalarında hayata geçirilen iş modelleri ile değer önerilerinin ilişkileri",
    field: "Business Administration", tags: ["smart cities", "business models", "value proposition"] },

  { student: "Fatih Sönmez", year: 2018, uni: "Bahçeşehir University", degree: "MSc", lang: "Turkish", id: "525109",
    title: "Assessing efficiency of R&D projects with data envelopment analysis",
    titleTr: "Veri zarflama analizi ile Ar-Ge projelerinin verimliliğinin değerlendirilmesi",
    field: "Industrial Engineering", tags: ["DEA", "R&D", "efficiency"] },

  { student: "Gülname Kır", year: 2014, uni: "Doğuş University", degree: "MSc", lang: "English", id: "376050",
    title: "Scrum adoption in Kuveyt Türk IT",
    titleTr: "Kuveyt Türk BT'de Scrum adaptasyonu",
    field: "Science and Technology Strategies", tags: ["Scrum", "agile", "IT"] }
];

/* Timeline. "kind" drives the icon + colour: edu | work | research | teaching | service */
window.SITE_TIMELINE = [
  { from: 1997, to: 2002, kind: "edu",
    titleEn: "BSc, Aeronautical Engineering", titleTr: "Lisans, Uçak Mühendisliği",
    orgEn: "Istanbul Technical University", orgTr: "İstanbul Teknik Üniversitesi",
    bodyEn: "Five years of aerodynamics, structures and systems thinking — the habit of treating a messy object as a model you can actually solve.",
    bodyTr: "Beş yıl aerodinamik, yapı ve sistem düşüncesi — karmaşık bir nesneyi çözülebilir bir modele dönüştürme alışkanlığı." },

  { from: 2002, to: 2005, kind: "edu",
    titleEn: "MSc, Engineering Management", titleTr: "Yüksek Lisans, Mühendislik Yönetimi",
    orgEn: "Istanbul Technical University", orgTr: "İstanbul Teknik Üniversitesi",
    bodyEn: "The move from how a thing is built to why it gets built, who decides, and what it costs.",
    bodyTr: "Bir şeyin nasıl yapıldığından neden yapıldığına, kimin karar verdiğine ve neye mal olduğuna geçiş." },

  { from: 2005, to: 2012, kind: "edu",
    titleEn: "PhD, Industrial Engineering", titleTr: "Doktora, Endüstri Mühendisliği",
    orgEn: "Istanbul Technical University", orgTr: "İstanbul Teknik Üniversitesi",
    bodyEn: "Operations research applied to problems that belong to cities and industries rather than to factories alone.",
    bodyTr: "Yöneylem araştırmasının yalnızca fabrikalara değil, şehirlere ve sanayilere ait problemlere uygulanması." },

  { from: 2012, to: null, kind: "teaching",
    titleEn: "Started teaching", titleTr: "Ders vermeye başladı",
    orgEn: "Istanbul", orgTr: "İstanbul",
    bodyEn: "The beginning of a teaching record that now spans seven universities, two languages and four recurring themes.",
    bodyTr: "Bugün yedi üniversiteye, iki dile ve dört ana temaya yayılan ders verme serüveninin başlangıcı." },

  { from: 2013, to: null, kind: "research",
    titleEn: "First indexed publications", titleTr: "İlk indeksli yayınlar",
    orgEn: "Interfaces · Transport Policy", orgTr: "Interfaces · Transport Policy",
    bodyEn: "Fire station siting for the Istanbul Metropolitan Municipality, and a gravity-based look at whether Turkey's road investments match demand.",
    bodyTr: "İstanbul Büyükşehir Belediyesi için itfaiye istasyonu yer seçimi ve Türkiye'nin yol yatırımlarının talebi karşılayıp karşılamadığına çekim modeliyle bakış." },

  { from: 2014, to: 2025, kind: "work",
    titleEn: "Teaching at Doğuş University", titleTr: "Doğuş Üniversitesi'nde ders",
    orgEn: "Industrial Engineering · Engineering Management", orgTr: "Endüstri Mühendisliği · Mühendislik Yönetimi",
    bodyEn: "A decade of product development, entrepreneurship and decision analysis courses — the core of the teaching record.",
    bodyTr: "On yıl boyunca ürün geliştirme, girişimcilik ve karar analizi dersleri — ders kaydının omurgası." },

  { from: 2006, to: null, kind: "research",
    titleEn: "A Popular Mechanics article about 3D printing", titleTr: "3B baskı üzerine bir Popular Mechanics yazısı",
    orgEn: "Later: a 3D printing lab at Doğuş University", orgTr: "Sonrasında: Doğuş Üniversitesi'nde bir 3B baskı laboratuvarı",
    bodyEn: "The article was enough to send me reading for the rest of the day. It eventually became a funded research project at Doğuş University, with a Formlabs Form 2 and an Ultimaker 2+ Extended to go with it.",
    bodyTr: "Yazı, günün geri kalanını okuyarak geçirmeme yetti. Zamanla Doğuş Üniversitesi'nde desteklenen bir araştırma projesine ve yanında bir Formlabs Form 2 ile bir Ultimaker 2+ Extended'a dönüştü." },

  { from: 2017, to: 2018, kind: "work",
    titleEn: "Teaching at Copenhagen Business School", titleTr: "Copenhagen Business School'da ders",
    orgEn: "Operations Management", orgTr: "Operasyon Yönetimi",
    bodyEn: "Two graduate courses on decision support and information management in supply chains.",
    bodyTr: "Tedarik zincirlerinde karar desteği ve bilgi yönetimi üzerine iki lisansüstü ders." },

  { from: 2015, to: 2025, kind: "service",
    titleEn: "Bahçeşehir University, Entrepreneurship & Innovation", titleTr: "Bahçeşehir Üniversitesi, Girişimcilik ve İnovasyon",
    orgEn: "Teaching and thesis supervision", orgTr: "Ders ve tez danışmanlığı",
    bodyEn: "Seven of the nine master's theses on this site were supervised here, on smart cities, R&D efficiency, Industry 4.0 and bio-innovation.",
    bodyTr: "Bu sitedeki dokuz yüksek lisans tezinin yedisi burada yönetildi: akıllı şehirler, Ar-Ge verimliliği, Endüstri 4.0 ve biyo-inovasyon üzerine." },

  { from: 2021, to: 2025, kind: "teaching",
    titleEn: "Teaching at Boğaziçi University", titleTr: "Boğaziçi Üniversitesi'nde ders",
    orgEn: "Computer Education and Educational Technology", orgTr: "Bilgisayar ve Öğretim Teknolojileri Eğitimi",
    bodyEn: "Four consecutive springs of Special Topics in Entrepreneurship and Innovation.",
    bodyTr: "Dört bahar dönemi üst üste Girişimcilik ve İnovasyonda Özel Konular." },

  { from: 2025, to: null, kind: "work",
    titleEn: "Istanbul University-Cerrahpaşa", titleTr: "İstanbul Üniversitesi-Cerrahpaşa",
    orgEn: "Department of Industrial Engineering", orgTr: "Endüstri Mühendisliği Bölümü",
    bodyEn: "Current post. Teaching mathematical programming, multivariate functions, applied entrepreneurship and technical English.",
    bodyTr: "Güncel görev. Matematiksel programlama, çok değişkenli fonksiyonlar, uygulamalı girişimcilik ve teknik İngilizce dersleri." },

  { from: 2026, to: null, kind: "research",
    titleEn: "Sustainable development goals & smart cities", titleTr: "Sürdürülebilir kalkınma amaçları ve akıllı şehirler",
    orgEn: "Environmental Modelling & Software · IJUS", orgTr: "Environmental Modelling & Software · IJUS",
    bodyEn: "Two 2026 papers: how the SDGs interact from an environmental perspective, and what value propositions smart city business models actually make.",
    bodyTr: "2026'da iki makale: SKA'ların çevresel açıdan nasıl etkileştiği ve akıllı şehir iş modellerinin gerçekte hangi değer önerilerini sunduğu." }
];
