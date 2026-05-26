(function () {
  'use strict';

  /* ── CURSOR ─────────────────────────────────────────────── */
  const cur   = document.getElementById('cur');
  const label = document.getElementById('curLabel');
  if (cur) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    });
    const ring = cur.querySelector('.cur-ring');
    (function tick() {
      rx += (mx - rx) * .1; ry += (my - ry) * .1;
      if (ring) { ring.style.left = (rx - mx) + 'px'; ring.style.top = (ry - my) + 'px'; }
      requestAnimationFrame(tick);
    })();
    // Cursor mode per discipline
    const iconMap = { pencil:'✏️ Draw', code:'</> Code', reel:'🎬 Watch' };
    document.querySelectorAll('[data-cursor]').forEach(el => {
      const mode = el.dataset.cursor;
      el.addEventListener('mouseenter', () => {
        cur.className = 'cur ' + mode;
        if (label) { label.textContent = iconMap[mode]||''; label.classList.toggle('show', !!iconMap[mode]); }
      });
      el.addEventListener('mouseleave', () => { cur.className = 'cur'; if (label) label.classList.remove('show'); });
    });
    // Hover scale
    document.querySelectorAll('a, button, .disc-card, .v-card, .g-item, .f-award-card, .social-icon').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('hover'));
      el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
    });
  }

  /* ── NAV ────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const upd = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', upd, { passive:true }); upd();
  }

  /* ── MOBILE MENU ─────────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const mobMenu = document.getElementById('mobMenu');
  const mobClose = document.getElementById('mobClose');
  if (burger && mobMenu) {
    burger.addEventListener('click', () => mobMenu.classList.add('open'));
    mobClose?.addEventListener('click', () => mobMenu.classList.remove('open'));
    mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobMenu.classList.remove('open')));
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revEls = document.querySelectorAll('.reveal-up, .reveal-fade');
  if (revEls.length && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold:.12 });
    revEls.forEach(el => ro.observe(el));
  } else { revEls.forEach(el => el.classList.add('in')); }

  /* ── COUNT UP ────────────────────────────────────────────── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const ro = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const target = +el.dataset.count;
      const step = target / 90; let cur = 0;
      const t = setInterval(() => { cur += step; if (cur >= target) { el.textContent = target; clearInterval(t); } else el.textContent = Math.floor(cur); }, 16);
      ro.unobserve(el);
    }, { threshold:.6 });
    ro.observe(el);
  });

  /* ── GALLERY FILTER ──────────────────────────────────────── */
  document.querySelectorAll('.filt').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.filter-row, .f-genres')?.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      if (!f) return;
      document.querySelectorAll('.g-item').forEach(item => {
        item.style.display = (f==='all' || item.dataset.cat===f) ? '' : 'none';
      });
    });
  });

  /* ── VIDEO MODAL ─────────────────────────────────────────── */
  const vModal = document.getElementById('vModal');
  const vVid   = document.getElementById('vModalVid');
  document.querySelector('.v-modal-close')?.addEventListener('click', closeVModal);
  vModal?.addEventListener('click', e => { if (e.target === vModal) closeVModal(); });
  function closeVModal() { if (vModal) { vModal.classList.remove('open'); vVid?.pause(); if (vVid) vVid.src = ''; } }
  window.openVideo = function(src) { if (vModal && vVid) { vVid.src = src; vModal.classList.add('open'); vVid.play().catch(()=>{}); } };

  /* ── FILM STRIP DRAG ─────────────────────────────────────── */
  const fStrip = document.getElementById('fStrip');
  if (fStrip) {
    let dn = false, sx, sl;
    fStrip.addEventListener('mousedown',  e => { dn=true; sx=e.pageX-fStrip.offsetLeft; sl=fStrip.scrollLeft; });
    fStrip.addEventListener('mouseleave', () => dn=false);
    fStrip.addEventListener('mouseup',    () => dn=false);
    fStrip.addEventListener('mousemove',  e => { if (!dn) return; e.preventDefault(); fStrip.scrollLeft = sl - (e.pageX-fStrip.offsetLeft-sx)*2; });
    let tx;
    fStrip.addEventListener('touchstart', e => { tx=e.touches[0].clientX; sl=fStrip.scrollLeft; }, {passive:true});
    fStrip.addEventListener('touchmove',  e => { fStrip.scrollLeft = sl-(e.touches[0].clientX-tx)*1.5; }, {passive:true});
  }

  /* ── HERO LOAD REVEAL ────────────────────────────────────── */
  window.addEventListener('load', () => {
    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('in');
    });
  });

})();
