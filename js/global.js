/* global.js — PAULI_B */
(function () {
  'use strict';

  /* ── CURSOR ─────────────────────────────────────────────── */
  const cur   = document.getElementById('cur');
  const label = document.getElementById('curLabel');
  if (cur) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });

    // Smooth ring follow
    (function tick() {
      rx += (mx - rx) * .1;
      ry += (my - ry) * .1;
      const ring = cur.querySelector('.cur-ring');
      if (ring) { ring.style.left = (rx - mx) + 'px'; ring.style.top = (ry - my) + 'px'; }
      requestAnimationFrame(tick);
    })();

    // Cursor mode changes on discipline cards
    document.querySelectorAll('[data-cursor]').forEach(el => {
      const mode = el.dataset.cursor;
      const icons = { pencil: '✏️ Draw', code: '💻 Code', reel: '🎬 Watch', default: '' };
      el.addEventListener('mouseenter', () => {
        cur.className = 'cur ' + mode;
        if (label) { label.textContent = icons[mode] || ''; label.classList.toggle('show', !!icons[mode]); }
      });
      el.addEventListener('mouseleave', () => {
        cur.className = 'cur';
        if (label) label.classList.remove('show');
      });
    });

    // Hover scale on links/buttons
    document.querySelectorAll('a, button, .disc-card, .v-card, .g-item').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('hover'));
      el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
    });
  }

  /* ── NAV ────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── MOBILE MENU ────────────────────────────────────────── */
  const burger  = document.getElementById('burger');
  const mobMenu = document.getElementById('mobMenu');
  const mobClose= document.getElementById('mobClose');
  if (burger && mobMenu) {
    burger.addEventListener('click',  () => mobMenu.classList.add('open'));
    mobClose?.addEventListener('click', () => mobMenu.classList.remove('open'));
    mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobMenu.classList.remove('open')));
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revEls = document.querySelectorAll('.reveal-up, .reveal-fade');
  if (revEls.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: .12 });
    revEls.forEach(el => ro.observe(el));
  }

  /* ── COUNT UP ───────────────────────────────────────────── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const ro = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const target = +el.dataset.count, dur = 1600;
      const step = target / (dur / 16);
      let cur = 0;
      const t = setInterval(() => { cur += step; if (cur >= target) { el.textContent = target; clearInterval(t); } else el.textContent = Math.floor(cur); }, 16);
      ro.unobserve(el);
    }, { threshold: .5 });
    ro.observe(el);
  });

  /* ── GALLERY FILTER ─────────────────────────────────────── */
  document.querySelectorAll('.filt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.g-item').forEach(item => {
        item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* ── VIDEO MODAL ────────────────────────────────────────── */
  const vModal = document.getElementById('vModal');
  const vVid   = document.getElementById('vModalVid');
  const vClose = document.querySelector('.v-modal-close');
  if (vClose) vClose.addEventListener('click', closeModal);
  if (vModal) vModal.addEventListener('click', e => { if (e.target === vModal) closeModal(); });
  function closeModal() { if (vModal) { vModal.classList.remove('open'); vVid?.pause(); if (vVid) vVid.src = ''; } }
  window.openVideo = function (src) { if (vModal && vVid) { vVid.src = src; vModal.classList.add('open'); vVid.play(); } };

  /* ── FILM STRIP DRAG ────────────────────────────────────── */
  const fStrip = document.getElementById('fStrip');
  if (fStrip) {
    let dn = false, sx, sl;
    fStrip.addEventListener('mousedown', e => { dn = true; sx = e.pageX - fStrip.offsetLeft; sl = fStrip.scrollLeft; });
    fStrip.addEventListener('mouseleave', () => dn = false);
    fStrip.addEventListener('mouseup',   () => dn = false);
    fStrip.addEventListener('mousemove', e => { if (!dn) return; e.preventDefault(); fStrip.scrollLeft = sl - (e.pageX - fStrip.offsetLeft - sx) * 2; });
  }

  /* ── GENRE FILTER (film) ────────────────────────────────── */
  document.querySelectorAll('.filt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ── HERO ANIMATE IN ────────────────────────────────────── */
  window.addEventListener('load', () => {
    document.querySelectorAll('.reveal-up, .reveal-fade').forEach((el, i) => {
      if (isInViewport(el)) setTimeout(() => el.classList.add('in'), i * 80);
    });
  });
  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

})();


// Live Email Form Handler
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async function(event) {
    event.preventDefault(); // Stop page reload
    
    status.style.display = "block";
    status.style.color = "var(--dim)";
    status.innerText = "Sending message...";

    const data = new FormData(event.target);
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        status.style.color = "var(--accent)"; // Saba Gold success accent
        status.innerText = "Thanks! Your message has been sent.";
        form.reset(); // Clear input field
      } else {
        const responseData = await response.json();
        if (Object.hasOwn(responseData, 'errors')) {
          status.innerText = responseData.errors.map(error => error.message).join(", ");
        } else {
          status.innerText = "Oops! There was a problem submitting your form.";
        }
        status.style.color = "#ff4a4a"; // Red error indicator
      }
    } catch (error) {
      status.style.color = "#ff4a4a";
      status.innerText = "Oops! Net network error occurred. Try again.";
    }
  });
}