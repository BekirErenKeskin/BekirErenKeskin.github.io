// ─────────────────────────────────────────────────────────────
// site-data.js — sitenin TEK veri dosyası.
//
// Buradaki metinleri değiştirip kaydetmen yeterli; başka hiçbir
// dosyaya dokunman gerekmiyor. Dikkat edilecek tek şey: her satırın
// sonundaki virgüller ve tırnak işaretleri bozulmasın.
//
//   suSiralar → Giriş bölümündeki "Şu sıralar" listesi (3-4 madde ideal)
//   notlar    → "03 Notlar" bölümü. url verirsen karta tıklanınca oraya
//               gider; vermezsen kart tıklanamaz düz kutu olur.
//   beholdFeedUrl → Instagram galerisinin Behold feed adresi.
//               Boş bırakılırsa ("") fotoğraf bölümü tamamen gizlenir.
//   vitrinGoster → "04 Vitrin" bölümünü aç/kapat (true/false).
//   gunluk    → Footer üstündeki katlanabilir "Site günlüğü" listesi.
//               Yeni satır eklemek için bir { date, text } bloğu kopyala.
// ─────────────────────────────────────────────────────────────

window.SITE_DATA = {
  beholdFeedUrl: "https://feeds.behold.so/IV7pXyHjUz4WN5sH3gdd",
  githubUser: "BekirErenKeskin",
  vitrinGoster: true,

  suSiralar: [
    "staja gidiyorum, calisiyorum.",
    "uygulama gelistirmeye calisiyorum",
    "daha paylasmam gereken bir sürü fotoğraf var",
  ],

  notlar: [
    {
      title: "Her insan bir kere düser",
      date: "13 Tem 2026",
      tag: "hayat",
      excerpt: "İlk kırımın suçlusu o değildi; dosta fazla güvenen bendim. Düşerken öğrenilenlerin listesi.",
      // url: "https://...",  ← istersen buraya link ekle
    },
    {
      title: "AI ile barışmak",
      date: "28 Haz 2026",
      tag: "gelecek",
      excerpt: "Grenli fotoğraf bozuk fotoğraf değildir. Işık azaldığında hikâye biter mi, başlar mı?",
    },
    {
      title: "LED'den telemetriye",
      date: "2 Mar 2026",
      tag: "gömülü",
      excerpt: "Datasheet okumak da bir okuma biçimiymiş. STM32 ile ilk ayın notları.",
    },
  ],

  gunluk: [
    { date: "Tem 2026", text: "Site Claude Design'da tasarlandı, Claude Code ile gerçek bir siteye dönüştürüldü." },
    { date: "Tem 2026", text: "Fotoğraf galerisi Instagram'a (Behold ile) bağlandı." },
    { date: "Tem 2026", text: "Projeler bölümü GitHub API'sine bağlandı." },
    { date: "Tem 2026", text: "Karanlık mod ve ufak tefek animasyonlar geldi." },
    { date: "Tem 2026", text: "Spotify 'şu an dinliyorum' kartı eklendi." },
    { date: "Tem 2026", text: "Ziyaretçi sayacı, iletişim formu ve bu günlük eklendi." },
    { date: "Tem 2026", text: "Tema değişiminde diyafram geçişi, proje kartlarında 3D tilt, GitHub yüklenirken iskelet animasyonu ve Spotify equalizer çubukları eklendi." },
    { date: "Tem 2026", text: "Tam favicon seti eklendi (tarayıcı sekmesi, telefon ana ekranı vb.)." },
    { date: "Tem 2026", text: "Özel 404 sayfası ve temel SEO (robots.txt, sitemap.xml, arama motoru bilgi kartı) eklendi." },
    { date: "Tem 2026", text: "Projeler bölümü artık GitHub'a değil kendi önbellekli sunucusuna bağlanıyor, sık gelen ziyaretçilerde daha hızlı." },
    { date: "Tem 2026", text: "Gerçek bir performans/erişilebilirlik taraması yapıldı ve bulunanlar düzeltildi: kontrast, sayfa yükleme hızı, görsel boyutları." },
  ],
};
