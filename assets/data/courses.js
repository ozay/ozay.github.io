/* ---------------------------------------------------------------------------
   Courses. "terms" lists every academic term the course was taught, newest
   first, in the form "YYYY-YYYY Season". The explorer derives the timeline,
   the counts and the "active" badge from this list, so adding a term is the
   only edit needed each semester.

   level : "ug" | "grad"      lang : "en" | "tr"
   theme : key from SITE_THEMES
--------------------------------------------------------------------------- */

window.SITE_ACTIVE_TERM = "2026-2027 Fall";

window.SITE_THEMES = {
  product:      { en: "Product Development",            tr: "Ürün Geliştirme" },
  supplychain:  { en: "Transportation & Supply Chains", tr: "Ulaştırma ve Tedarik Zincirleri" },
  entrepreneur: { en: "Entrepreneurship & Innovation",  tr: "Girişimcilik ve İnovasyon" },
  decision:     { en: "Decision Making",                tr: "Karar Verme" },
  foundations:  { en: "Foundations",                    tr: "Temel Dersler" }
};

window.SITE_UNIVERSITIES = {
  iuc:  { name: "Istanbul University-Cerrahpaşa", short: "IUC" },
  dogus:{ name: "Doğuş University",               short: "Doğuş" },
  bau:  { name: "Bahçeşehir University",          short: "BAU" },
  bogazici:{ name: "Boğaziçi University",         short: "Boğaziçi" },
  cbs:  { name: "Copenhagen Business School",     short: "CBS" },
  mef:  { name: "MEF University",                 short: "MEF" },
  maltepe:{ name: "Maltepe University",           short: "Maltepe" }
};

window.SITE_COURSES = [
  { title: "Technical English 1", uni: "iuc", dept: "Industrial Engineering", level: "ug", lang: "en", theme: "foundations",
    terms: ["2026-2027 Fall", "2025-2026 Fall"] },

  { title: "Multivariate Functions and Applications", uni: "iuc", dept: "Industrial Engineering", level: "ug", lang: "en", theme: "foundations",
    terms: ["2026-2027 Fall", "2025-2026 Fall"] },

  { title: "İleri Matematik Programlama", uni: "iuc", dept: "Industrial Engineering (Graduate Program)", level: "grad", lang: "tr", theme: "decision",
    terms: ["2026-2027 Fall", "2025-2026 Fall"] },

  { title: "Uygulamalı Girişimcilik", uni: "iuc", dept: "Industrial Engineering", level: "ug", lang: "tr", theme: "entrepreneur",
    terms: ["2025-2026 Spring"] },

  { title: "Technical English 2", uni: "iuc", dept: "Industrial Engineering", level: "ug", lang: "en", theme: "foundations",
    terms: ["2025-2026 Spring"] },

  { title: "Special Topics in Entrepreneurship and Innovation", uni: "bogazici", dept: "Computer Education and Educational Technology", level: "ug", lang: "en", theme: "entrepreneur",
    terms: ["2024-2025 Spring", "2023-2024 Spring", "2022-2023 Spring", "2021-2022 Spring"] },

  { title: "Ürün Tasarımı ve Ürün Geliştirme", uni: "dogus", dept: "Engineering Management", level: "grad", lang: "tr", theme: "product",
    terms: ["2024-2025 Spring", "2023-2024 Spring", "2022-2023 Spring", "2021-2022 Spring", "2018-2019 Spring"] },

  { title: "Product and Process Development", uni: "dogus", dept: "Industrial Engineering", level: "ug", lang: "en", theme: "product",
    terms: ["2024-2025 Fall", "2023-2024 Fall", "2022-2023 Fall", "2021-2022 Fall", "2020-2021 Fall", "2019-2020 Fall", "2018-2019 Fall", "2016-2017 Fall", "2015-2016 Fall", "2014-2015 Fall"] },

  { title: "Entrepreneurship and Innovation", uni: "dogus", dept: "Industrial Engineering", level: "ug", lang: "en", theme: "entrepreneur",
    terms: ["2024-2025 Fall", "2023-2024 Fall", "2022-2023 Fall", "2021-2022 Fall", "2020-2021 Fall", "2019-2020 Fall", "2018-2019 Fall", "2016-2017 Fall", "2015-2016 Spring", "2014-2015 Fall"] },

  { title: "Girişimcilik ve Yenilikçilik", uni: "dogus", dept: "Industrial Engineering", level: "ug", lang: "tr", theme: "entrepreneur",
    terms: ["2024-2025 Fall", "2023-2024 Fall", "2022-2023 Fall", "2021-2022 Fall", "2020-2021 Fall", "2019-2020 Fall", "2018-2019 Fall", "2016-2017 Fall", "2015-2016 Fall", "2014-2015 Fall"] },

  { title: "Ürün ve Süreç Geliştirme", uni: "dogus", dept: "Industrial Engineering", level: "ug", lang: "tr", theme: "product",
    terms: ["2024-2025 Fall", "2023-2024 Fall", "2022-2023 Fall", "2021-2022 Fall", "2020-2021 Fall", "2019-2020 Fall", "2016-2017 Fall", "2015-2016 Fall", "2014-2015 Fall"] },

  { title: "Design Thinking and Innovation", uni: "bau", dept: "Business Administration", level: "grad", lang: "en", theme: "entrepreneur",
    terms: ["2023-2024 Fall"] },

  { title: "New Venture Business Planning", uni: "bau", dept: "Entrepreneurship and Innovation Management", level: "grad", lang: "en", theme: "entrepreneur",
    terms: ["2021-2022 Fall"] },

  { title: "Introduction to Multi-criteria Decision Analysis", uni: "dogus", dept: "Industrial Engineering", level: "ug", lang: "en", theme: "decision",
    terms: ["2020-2021 Spring", "2019-2020 Spring", "2018-2019 Spring", "2017-2018 Spring", "2016-2017 Spring", "2015-2016 Spring"] },

  { title: "Çok Amaçlı Karar Analizine Giriş", uni: "dogus", dept: "Industrial Engineering", level: "ug", lang: "tr", theme: "decision",
    terms: ["2020-2021 Spring", "2019-2020 Spring", "2018-2019 Spring", "2017-2018 Spring", "2016-2017 Spring", "2015-2016 Spring"] },

  { title: "Karar Destek Sistemleri", uni: "dogus", dept: "Engineering Management", level: "grad", lang: "tr", theme: "decision",
    terms: ["2020-2021 Spring", "2019-2020 Spring"] },

  { title: "Logistics Planning and Modelling", uni: "maltepe", dept: "Industrial Engineering", level: "ug", lang: "en", theme: "supplychain",
    terms: ["2020-2021 Spring"] },

  { title: "Starting Up an Innovative Business", uni: "bau", dept: "Entrepreneurship and Innovation Management", level: "grad", lang: "en", theme: "entrepreneur",
    terms: ["2019-2020 Fall", "2018-2019 Fall", "2015-2016 Fall"] },

  { title: "Production Systems Analysis", uni: "dogus", dept: "Control Engineering", level: "ug", lang: "en", theme: "product",
    terms: ["2018-2019 Spring", "2017-2018 Spring", "2016-2017 Spring"] },

  { title: "Girişimcilik ve İnovasyon Yönetimi", uni: "bau", dept: "Business Administration", level: "grad", lang: "tr", theme: "entrepreneur",
    terms: ["2017-2018 Spring"] },

  { title: "Advanced Decision Support and Analysis for Supply Chain Management", uni: "cbs", dept: "Operations Management", level: "grad", lang: "en", theme: "supplychain",
    terms: ["2017-2018 Fall"] },

  { title: "Information Management in the Supply Chain", uni: "cbs", dept: "Operations Management", level: "grad", lang: "en", theme: "supplychain",
    terms: ["2017-2018 Fall"] },

  { title: "Breakthrough Thinking, Creativity, and Innovation", uni: "bau", dept: "Entrepreneurship and Innovation Management", level: "grad", lang: "en", theme: "entrepreneur",
    terms: ["2016-2017 Fall"] },

  { title: "Decision Support Systems", uni: "dogus", dept: "Engineering Management", level: "grad", lang: "en", theme: "decision",
    terms: ["2016-2017 Spring"] },

  { title: "Operations Management", uni: "mef", dept: "Business Administration", level: "ug", lang: "en", theme: "product",
    terms: ["2015-2016 Spring"] },

  { title: "Design in Product Development", uni: "bau", dept: "Entrepreneurship and Innovation Management", level: "grad", lang: "en", theme: "product",
    terms: ["2015-2016 Fall"] },

  { title: "Business and Society", uni: "dogus", dept: "Industrial Engineering", level: "ug", lang: "en", theme: "foundations",
    terms: ["2014-2015 Spring"] },

  { title: "İşletme ve Toplum", uni: "dogus", dept: "Industrial Engineering", level: "ug", lang: "tr", theme: "foundations",
    terms: ["2014-2015 Spring"] }
];
