// main.js — canlı veri (Behold + GitHub) ve küçük etkileşimler.
// Düzenlenecek içerikler js/site-data.js dosyasında.
(function () {
  'use strict';
  var DATA = window.SITE_DATA || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ── Şu sıralar ── */
  (DATA.suSiralar || []).forEach(function (text) {
    var li = el('li');
    li.appendChild(el('span', 'dot'));
    li.appendChild(document.createTextNode(text));
    document.getElementById('now-list').appendChild(li);
  });

  /* ── Notlar ── */
  var noteList = document.getElementById('note-list');
  (DATA.notlar || []).forEach(function (n) {
    var row = el(n.url ? 'a' : 'div', 'note-row');
    if (n.url) { row.href = n.url; row.target = '_blank'; row.rel = 'noopener'; }
    row.appendChild(el('span', 'note-date', n.date));
    var main = el('span', 'note-main');
    main.appendChild(el('span', 'note-title', n.title));
    main.appendChild(el('span', 'note-excerpt', n.excerpt));
    row.appendChild(main);
    row.appendChild(el('span', 'tag tag-accent-2', n.tag));
    noteList.appendChild(row);
  });
  var noteNext = el('div', 'note-next');
  noteNext.innerHTML = '+ sıradaki not — <b>site-data.js</b>\'e bir kayıt eklemek yetiyor.';
  noteList.appendChild(noteNext);

  /* ── Site günlüğü ── */
  var gunlukList = document.getElementById('gunluk-list');
  (DATA.gunluk || []).forEach(function (g) {
    var li = el('li');
    li.appendChild(el('span', 'g-tarih', g.date));
    li.appendChild(el('span', null, g.text));
    gunlukList.appendChild(li);
  });
  if (!gunlukList.children.length) document.getElementById('gunluk').hidden = true;

  /* ── Vitrin aç/kapat ── */
  if (DATA.vitrinGoster === false) document.getElementById('vitrin').hidden = true;

  /* ── Fotoğraf galerisi (Behold) ── */
  (function () {
    var url = DATA.beholdFeedUrl;
    if (!url) { // bölüm zaten hidden; nav linkini de gizle
      var navLink = document.querySelector('.topnav a[href="#foto"]');
      if (navLink) navLink.hidden = true;
      return;
    }
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('feed ' + res.status);
        return res.json();
      })
      .then(function (feed) {
        var posts = (feed && feed.posts ? feed.posts : []).slice(0, 6);
        if (!posts.length) return;
        var strip = document.getElementById('filmstrip');
        posts.forEach(function (p, i) {
          var frameNo = String(7 + Math.floor(i / 2)).padStart(2, '0') + (i % 2 ? 'A' : '');
          var caption = (p.prunedCaption || p.caption || '').split('\n')[0];
          if (caption.length > 60) caption = caption.slice(0, 57) + '…';
          var src = (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || p.thumbnailUrl || p.mediaUrl;
          if (!src) return;
          var srcsetParcalari = [];
          if (p.sizes && p.sizes.small) srcsetParcalari.push(p.sizes.small.mediaUrl + ' 300w');
          if (p.sizes && p.sizes.medium) srcsetParcalari.push(p.sizes.medium.mediaUrl + ' 525w');
          if (p.sizes && p.sizes.large) srcsetParcalari.push(p.sizes.large.mediaUrl + ' 750w');

          var card = el('a', 'film-card');
          if (p.permalink) { card.href = p.permalink; card.target = '_blank'; card.rel = 'noopener'; }
          var fig = el('figure');
          var meta = el('div', 'film-meta');
          meta.appendChild(el('span', null, 'ESTE 400'));
          meta.appendChild(el('span', null, '▸ ' + frameNo));
          fig.appendChild(meta);
          var frame = el('div', 'film-frame');
          var img = document.createElement('img');
          img.src = src;
          if (srcsetParcalari.length) {
            img.srcset = srcsetParcalari.join(', ');
            img.sizes = '(min-width: 641px) 380px, 236px';
          }
          img.alt = caption || 'Instagram fotoğrafı';
          img.loading = 'lazy';
          frame.appendChild(img);
          fig.appendChild(frame);
          fig.appendChild(el('figcaption', null, caption || '—'));
          card.appendChild(fig);
          strip.appendChild(card);
        });
        if (strip.children.length) document.getElementById('foto').hidden = false;
      })
      .catch(function () { /* feed ulaşılamazsa bölüm gizli kalır */ })
      .finally(function () {
        if (document.getElementById('foto').hidden) {
          var navLink = document.querySelector('.topnav a[href="#foto"]');
          if (navLink) navLink.hidden = true;
        }
      });
  })();

  /* ── Projeler (GitHub API) ── */
  (function () {
    var list = document.getElementById('repo-list');
    var user = DATA.githubUser;

    function relTime(iso) {
      var gun = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
      if (gun <= 0) return 'bugün';
      if (gun === 1) return 'dün';
      if (gun < 7) return gun + ' gün önce';
      if (gun < 14) return 'geçen hafta';
      if (gun < 30) return Math.floor(gun / 7) + ' hafta önce';
      if (gun < 60) return 'geçen ay';
      if (gun < 365) return Math.floor(gun / 30) + ' ay önce';
      return Math.floor(gun / 365) + ' yıl önce';
    }

    var DOT = {
      'Python': 'var(--color-accent-2)',
      'C': 'var(--color-accent)',
      'C++': 'var(--color-accent-700)',
      'HTML': 'var(--color-accent-400)',
      'JavaScript': 'var(--color-accent-2-500)',
    };
    var STAR_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"></path></svg>';

    function iskeletGoster(n) {
      for (var i = 0; i < n; i++) {
        var row = el('div', 'repo-row skeleton-row');
        row.appendChild(el('span', 'skeleton skeleton-name'));
        row.appendChild(el('span', 'skeleton skeleton-desc'));
        row.appendChild(el('span', 'skeleton skeleton-meta'));
        list.appendChild(row);
      }
    }

    function fallback() {
      list.innerHTML = '';
      var a = el('a', 'repo-fallback', 'github.com/' + user + ' ↗');
      a.href = 'https://github.com/' + user;
      a.target = '_blank';
      a.rel = 'noopener';
      list.appendChild(a);
    }

    iskeletGoster(3);

    fetch('/api/projeler')
      .then(function (res) {
        if (!res.ok) throw new Error('projeler ' + res.status);
        return res.json();
      })
      .then(function (repos) {
        if (!repos || !repos.length) return fallback();
        list.innerHTML = '';
        repos.forEach(function (r) {
          var row = el('a', 'repo-row');
          row.href = r.url;
          row.target = '_blank';
          row.rel = 'noopener';
          row.appendChild(el('span', 'repo-name', r.name));
          row.appendChild(el('span', 'repo-desc', r.desc || '—'));
          var meta = el('span', 'repo-meta');
          if (r.lang) {
            var lang = el('span', 'lang');
            var dot = el('span', 'lang-dot');
            dot.style.background = DOT[r.lang] || 'var(--color-neutral-500)';
            lang.appendChild(dot);
            lang.appendChild(document.createTextNode(r.lang));
            meta.appendChild(lang);
          }
          var stars = el('span', 'stars');
          stars.innerHTML = STAR_SVG;
          stars.appendChild(document.createTextNode(' ' + r.stars));
          meta.appendChild(stars);
          meta.appendChild(el('span', null, relTime(r.updated)));
          row.appendChild(meta);
          list.appendChild(row);
        });
      })
      .catch(fallback);

    /* — 3D tilt: sadece fare + hassas işaretçili cihazlarda — */
    var tiltDestekli = !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (tiltDestekli) {
      var MAX_TILT = 6;
      var tiltRaf = null;
      list.addEventListener('mousemove', function (e) {
        var row = e.target.closest('.repo-row');
        if (!row || row.classList.contains('skeleton-row')) return;
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        tiltRaf = requestAnimationFrame(function () {
          var r = row.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          var rotY = (px - 0.5) * MAX_TILT * 2;
          var rotX = (0.5 - py) * MAX_TILT * 2;
          row.style.transition = 'none';
          row.style.transform = 'perspective(700px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
        });
      });
      list.addEventListener('mouseout', function (e) {
        var row = e.target.closest('.repo-row');
        if (!row || row.classList.contains('skeleton-row')) return;
        if (row.contains(e.relatedTarget)) return;
        row.style.transition = 'transform .35s ease';
        row.style.transform = 'perspective(700px)';
      });
    }
  })();

  /* ── Vitrin: Nakar kartına 3D tilt (repo kartlarıyla aynı mantık, kart büyük olduğu için açı daha düşük) ── */
  (function () {
    var kart = document.getElementById('nakar-card');
    if (!kart) return;
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var MAX_TILT = 3.5;
    var raf = null;
    kart.addEventListener('mousemove', function (e) {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var r = kart.getBoundingClientRect();
        var rotY = ((e.clientX - r.left) / r.width - 0.5) * MAX_TILT * 2;
        var rotX = (0.5 - (e.clientY - r.top) / r.height) * MAX_TILT * 2;
        kart.style.transition = 'none';
        kart.style.transform = 'perspective(900px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
      });
    });
    kart.addEventListener('mouseleave', function () {
      kart.style.transition = 'transform .35s ease';
      kart.style.transform = 'perspective(900px)';
    });
  })();

  /* ── Yıl ── */
  document.getElementById('yil').textContent = new Date().getFullYear();

  /* ── Açık/koyu tema: diyafram (dairesel) geçişi ── */
  document.getElementById('tema-btn').addEventListener('click', function (e) {
    var koyu = document.documentElement.getAttribute('data-tema') === 'koyu';
    var tema = koyu ? 'acik' : 'koyu';
    var uygulandi = false;
    function uygula() {
      if (uygulandi) return;
      uygulandi = true;
      document.documentElement.setAttribute('data-tema', tema);
      try { localStorage.setItem('bek-tema', tema); } catch (err) {}
    }

    if (reduceMotion || !document.startViewTransition) {
      uygula();
      return;
    }

    try {
      var x = e.clientX;
      var y = e.clientY;
      var endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      var transition = document.startViewTransition(uygula);
      transition.ready
        .then(function () {
          document.documentElement.animate(
            {
              clipPath: [
                'circle(0px at ' + x + 'px ' + y + 'px)',
                'circle(' + endRadius + 'px at ' + x + 'px ' + y + 'px)',
              ],
            },
            { duration: 420, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
          );
        })
        .catch(function () { /* daire animasyonu başarısız olsa da tema zaten değişti */ });
      // Beklenmedik bir durumda transition hiç tamamlanmazsa tema yine de uygulansın
      transition.finished.catch(function () { uygula(); });
    } catch (err) {
      uygula();
    }
  });

  /* ── Hero'da fareyi izleyen ışık ── */
  var isik = document.getElementById('hero-isik');
  var giris = document.getElementById('giris');
  if (!reduceMotion && isik) {
    giris.addEventListener('mousemove', function (e) {
      var r = giris.getBoundingClientRect();
      isik.style.transform = 'translate(' + (e.clientX - r.left - 170) + 'px,' + (e.clientY - r.top - 170) + 'px)';
      isik.style.opacity = '1';
    });
    giris.addEventListener('mouseleave', function () {
      isik.style.opacity = '0';
    });
  }

  /* ── Scroll'da belirme ── */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('#foto, #proje, #notlar, #vitrin, #iletisim, #gunluk').forEach(function (sec) {
      sec.classList.add('reveal');
      io.observe(sec);
    });
  }

  /* ── Konsol sürprizi ── */
  try {
    console.log(
      '%c' +
        '        _____\n' +
        ' .-----[_____]-----------.\n' +
        ' |   .-------.           |\n' +
        ' |  |  (===)  | ESTE 400 |\n' +
        ' |  |  (===)  |     (o)  |\n' +
        " |   '-------'           |\n" +
        " '-----------------------'\n",
      'color:#c67139;font-family:monospace;line-height:1.25'
    );
    console.log(
      '%cKonsolu açtın demek. Burası sahne arkası — kablolar ortada, kusura bakma.\n' +
        'Merak ettiysen kodun tamamı github.com/BekirErenKeskin\'de. Kurcalamak serbest.',
      'color:#82796a;font-family:monospace'
    );
  } catch (e) {}

  /* ── Retro ziyaretçi sayacı ── */
  (function () {
    fetch('/api/ziyaret')
      .then(function (res) {
        if (!res.ok) throw new Error('ziyaret ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data == null || typeof data.toplam !== 'number') return;
        var digits = document.getElementById('sayac-digits');
        String(data.toplam).padStart(6, '0').split('').forEach(function (d) {
          digits.appendChild(el('span', 'sayac-digit', d));
        });
        document.getElementById('sayac').hidden = false;
      })
      .catch(function () { /* sayaç gelmezse footer sade kalır */ });
  })();

  /* ── İletişim formu (Web3Forms) ── */
  (function () {
    var form = document.getElementById('iletisim-form');
    var btn = document.getElementById('form-btn');
    var durum = document.getElementById('form-durum');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = 'gönderiliyor…';
      durum.textContent = '';
      durum.classList.remove('basarili');
      var fd = new FormData(form);
      fd.append('access_key', 'cd06855f-e2d0-4e3e-aff3-bedfac10db32');
      fd.append('subject', 'bekirerenkeskin.com.tr üzerinden yeni mesaj');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) {
            form.reset();
            durum.textContent = 'Ulaştı. Teşekkürler — en kısa zamanda dönerim.';
            durum.classList.add('basarili');
          } else {
            throw new Error('web3forms');
          }
        })
        .catch(function () {
          durum.textContent = 'Bir şeyler ters gitti. İstersen doğrudan e-posta ile yaz.';
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = 'gönder';
        });
    });
  })();

  /* ── Spotify "şu an dinliyorum" ── */
  (function () {
    var card = document.getElementById('spotify-card');
    fetch('/api/now-playing')
      .then(function (res) {
        if (!res.ok) throw new Error('now-playing ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.title) return; // çalan/son dinlenen şarkı yoksa kart gizli kalır
        document.getElementById('spotify-title').textContent = data.title;
        document.getElementById('spotify-artist').textContent = data.artist || '';
        document.getElementById('spotify-label-text').textContent = data.isPlaying ? 'şu an dinliyorum' : 'son dinlenen';
        if (data.albumArt) document.getElementById('spotify-art-img').src = data.albumArt;
        if (data.songUrl) card.href = data.songUrl;
        card.classList.toggle('is-playing', !!data.isPlaying);
        card.hidden = false;
      })
      .catch(function () { /* Worker'a ulaşılamazsa kart sessizce gizli kalır */ });
  })();
})();
