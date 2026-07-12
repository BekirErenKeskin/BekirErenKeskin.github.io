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
};
