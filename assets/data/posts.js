/* ---------------------------------------------------------------------------
   Blog index. To publish a post:
     1. write  content/posts/<slug>.en.md        (and <slug>.tr.md if translated)
     2. add an entry at the TOP of this array
   Nothing else. `minutes` is the reading estimate shown on the card; `hasTr`
   tells the reader whether a Turkish version exists.
--------------------------------------------------------------------------- */
window.SITE_POSTS = [
  {
    slug: "a-site-of-my-own",
    date: "2026-10-21",
    minutes: 3,
    hasTr: true,
    tags: ["meta", "teaching"],
    titleEn: "A site of my own",
    titleTr: "Kendime ait bir site",
    excerptEn: "Fourteen years of courses and publications had quietly turned into a list nobody could read. So I rebuilt the thing around the questions people actually arrive with.",
    excerptTr: "On dört yıllık dersler ve yayınlar, sessizce kimsenin okuyamayacağı bir listeye dönüşmüştü. Ben de siteyi, insanların gerçekten geldiği sorular etrafında yeniden kurdum."
  },
  {
    slug: "popular-mechanics",
    date: "2026-10-21",
    minutes: 2,
    hasTr: true,
    tags: ["3d printing", "research"],
    titleEn: "The Popular Mechanics article that stuck",
    titleTr: "Aklımda kalan Popular Mechanics yazısı",
    excerptEn: "In 2006 I read one article about 3D printing and spent the rest of the day reading about it. Years later it became a funded project and two printers in a university lab.",
    excerptTr: "2006'da 3B baskı üzerine bir yazı okudum ve günün geri kalanını bu konuyu araştırarak geçirdim. Yıllar sonra bu, desteklenen bir projeye ve bir üniversite laboratuvarındaki iki yazıcıya dönüştü."
  }
];
