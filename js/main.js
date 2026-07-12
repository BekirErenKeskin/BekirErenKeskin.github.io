// main.js — canlı veri (Behold + GitHub) ve küçük etkileşimler.
// Düzenlenecek içerikler js/site-data.js dosyasında.
(function () {
  'use strict';
  var DATA = window.SITE_DATA || {};

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

    function fallback() {
      var a = el('a', 'repo-fallback', 'github.com/' + user + ' ↗');
      a.href = 'https://github.com/' + user;
      a.target = '_blank';
      a.rel = 'noopener';
      list.appendChild(a);
    }

    fetch('https://api.github.com/users/' + user + '/repos?sort=updated&per_page=100')
      .then(function (res) {
        if (!res.ok) throw new Error('github ' + res.status);
        return res.json();
      })
      .then(function (repos) {
        repos = (repos || [])
          .filter(function (r) { return !r.fork; })
          .sort(function (a, b) { return new Date(b.updated_at) - new Date(a.updated_at); });
        if (!repos.length) return fallback();
        repos.forEach(function (r) {
          var row = el('a', 'repo-row');
          row.href = r.html_url;
          row.target = '_blank';
          row.rel = 'noopener';
          row.appendChild(el('span', 'repo-name', r.name));
          row.appendChild(el('span', 'repo-desc', r.description || '—'));
          var meta = el('span', 'repo-meta');
          if (r.language) {
            var lang = el('span', 'lang');
            var dot = el('span', 'lang-dot');
            dot.style.background = DOT[r.language] || 'var(--color-neutral-500)';
            lang.appendChild(dot);
            lang.appendChild(document.createTextNode(r.language));
            meta.appendChild(lang);
          }
          var stars = el('span', 'stars');
          stars.innerHTML = STAR_SVG;
          stars.appendChild(document.createTextNode(' ' + r.stargazers_count));
          meta.appendChild(stars);
          meta.appendChild(el('span', null, relTime(r.updated_at)));
          row.appendChild(meta);
          list.appendChild(row);
        });
      })
      .catch(fallback);
  })();

  /* ── Yıl ── */
  document.getElementById('yil').textContent = new Date().getFullYear();

  /* ── Scroll'da belirme ── */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('section').forEach(function (sec) {
      sec.classList.add('reveal');
      io.observe(sec);
    });
  }
})();
