/* ---------------------------------------------------------------------------
   Blog index. To publish a post:
     1. write  content/posts/<slug>.en.md        (and <slug>.tr.md if translated)
     2. add an entry at the TOP of this array
   Nothing else. `minutes` is the reading estimate shown on the card; `hasTr`
   tells the reader whether a Turkish version exists.

   A post dated in the future is written but not yet listed: blog.js hides it
   until its date arrives, so a series can be queued here in one go. Direct
   links (post.html?p=<slug>) still work, so nothing is secret — just unlisted.
--------------------------------------------------------------------------- */
window.SITE_POSTS = [
  {
    slug: "people-who-didnt-come-for-it",
    date: "2026-12-26",
    minutes: 4,
    hasTr: true,
    tags: ["design", "teaching"],
    titleEn: "People who didn't come for it",
    titleTr: "Bunun için gelmemiş olanlar",
    excerptEn: "A student thesis project from 2012 and a bank museum in Karaköy are doing the same job: explaining a subject to an audience that can walk out. University teaching has a captive one, and that is a subsidy.",
    excerptTr: "2012'den bir bitirme projesi ile Karaköy'deki bir banka müzesi aynı işi yapıyor: çıkıp gidebilecek bir izleyiciye bir konuyu anlatmak. Üniversitede ders verirken izleyici tutsak ve bu bir sübvansiyon."
  },
  {
    slug: "two-kinds-of-disappearing",
    date: "2026-12-19",
    minutes: 4,
    hasTr: true,
    tags: ["design", "meta"],
    titleEn: "Two kinds of disappearing",
    titleTr: "İki tür kaybolma",
    excerptEn: "Antonio Saura died in 1998 and his site is immaculate. Fernanda Cohen is alive and her domain no longer resolves. What survives online is not about quality — it is about whether an institution is paying the bill.",
    excerptTr: "Antonio Saura 1998'de öldü, sitesi kusursuz duruyor. Fernanda Cohen hayatta, alan adı ise artık çözümlenmiyor. İnternette ayakta kalan şey kaliteyle değil, faturayı bir kurumun ödeyip ödemediğiyle ilgili."
  },
  {
    slug: "inking-is-a-handoff",
    date: "2026-12-12",
    minutes: 3,
    hasTr: true,
    tags: ["design", "teaching"],
    titleEn: "Inking is a handoff",
    titleTr: "Mürekkepleme bir devir teslimdir",
    excerptEn: "Mainstream comics runs the most explicit division of labour in any creative industry — writer, penciller, inker, colourist, letterer — and publishes the credits every month. Dan Davis worked the station in the middle.",
    excerptTr: "Ana akım çizgi roman, herhangi bir yaratıcı sektördeki en açık iş bölümünü yürütüyor — yazar, çizer, mürekkepçi, renklendirici, harflendirici — ve künyeyi her ay yayımlıyor. Dan Davis ortadaki istasyonda çalıştı."
  },
  {
    slug: "a-room-in-munich",
    date: "2026-12-05",
    minutes: 3,
    hasTr: true,
    tags: ["design", "teaching"],
    titleEn: "A room in Munich",
    titleTr: "Münih'te bir salon",
    excerptEn: "Twenty years of the TOCA ME design conference. My field organises itself around journals; design organises itself around a room. Each form preserves exactly what the other throws away.",
    excerptTr: "TOCA ME tasarım konferansının yirmi yılı. Benim alanım kendini dergiler etrafında örgütlüyor; tasarım bir salonun etrafında. Her biçim, diğerinin attığı şeyi saklıyor."
  },
  {
    slug: "the-least-glamorous-link",
    date: "2026-11-28",
    minutes: 3,
    hasTr: true,
    tags: ["design", "research"],
    titleEn: "The least glamorous link",
    titleTr: "En gösterişsiz bağlantı",
    excerptEn: "One entry on my list is not an artist but an agency, founded in 1977. It is the only link that explains how the other eleven get paid — and it is the institution that was missing when Simon Oxley sold the Twitter bird.",
    excerptTr: "Listemdeki bir girdi sanatçı değil, 1977'de kurulmuş bir ajans. Diğer on birinin parasını nasıl kazandığını açıklayan tek bağlantı — ve Simon Oxley Twitter kuşunu satarken eksik olan kurum."
  },
  {
    slug: "the-wrong-software",
    date: "2026-11-21",
    minutes: 3,
    hasTr: true,
    tags: ["design", "3d printing"],
    titleEn: "The wrong software",
    titleTr: "Yanlış yazılım",
    excerptEn: "Ray Caesar makes still portraits in Maya, animation software built for crews working at twenty-four frames a second. Use a tool at the wrong scale and every constraint it was designed around stops applying.",
    excerptTr: "Ray Caesar, saniyede yirmi dört kare üreten ekipler için yapılmış animasyon yazılımı Maya ile hareketsiz portreler yapıyor. Bir aracı yanlış ölçekte kullanın, etrafında tasarlandığı bütün kısıtlar geçersizleşir."
  },
  {
    slug: "the-studio-that-became-a-person",
    date: "2026-11-14",
    minutes: 3,
    hasTr: true,
    tags: ["design"],
    titleEn: "The studio that became a person",
    titleTr: "İnsana dönüşen stüdyo",
    excerptEn: "My link says Red Silas; it lands on Christopher Silas Neal. A studio name is a hedge, and dropping it is a decision about where the work ends and you begin.",
    excerptTr: "Bağlantımda Red Silas yazıyor; Christopher Silas Neal'a düşüyor. Stüdyo adı bir korunma aracıdır ve onu bırakmak, işin nerede bitip sizin nerede başladığınıza dair bir karardır."
  },
  {
    slug: "draw-badly-draw-often",
    date: "2026-11-07",
    minutes: 3,
    hasTr: true,
    tags: ["design", "teaching"],
    titleEn: "Draw badly, draw often",
    titleTr: "Kötü çiz, çok çiz",
    excerptEn: "Jon Burgerman has engineered his practice so one attempt costs nothing. Our design courses do the opposite — and then we are puzzled when students converge early on a safe idea and defend it.",
    excerptTr: "Jon Burgerman pratiğini, tek bir denemenin hiçbir şeye mal olmayacağı şekilde kurmuş. Tasarım derslerimiz tam tersini yapıyor — sonra öğrenciler erkenden güvenli bir fikre yakınsayıp onu savununca şaşırıyoruz."
  },
  {
    slug: "leaving-things-out",
    date: "2026-10-31",
    minutes: 3,
    hasTr: true,
    tags: ["design", "teaching"],
    titleEn: "Leaving things out",
    titleTr: "Dışarıda bırakmak",
    excerptEn: "Adrian Johnson's palette is a specification written before the brief arrives. Engineers accept this logic for a standard parts list and resist it everywhere we think of the work as creative.",
    excerptTr: "Adrian Johnson'ın paleti, brief gelmeden önce yazılmış bir şartname. Mühendisler bu mantığı standart parça listesi için kabul eder, işi yaratıcı saydığımız her yerde ise direnir."
  },
  {
    slug: "the-bird-was-fifteen-dollars",
    date: "2026-10-24",
    minutes: 3,
    hasTr: true,
    tags: ["design", "research"],
    titleEn: "The bird was fifteen dollars",
    titleTr: "Kuş on beş dolardı",
    excerptEn: "Simon Oxley drew the original Twitter bird and the GitHub Octocat. He made almost nothing from the first and was paid properly for the second, and the difference has nothing to do with the drawings.",
    excerptTr: "Simon Oxley orijinal Twitter kuşunu ve GitHub'ın Octocat'ini çizdi. İlkinden neredeyse hiç kazanmadı, ikincisinin karşılığını usulünce aldı ve aradaki farkın çizimlerle hiçbir ilgisi yok."
  },
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
