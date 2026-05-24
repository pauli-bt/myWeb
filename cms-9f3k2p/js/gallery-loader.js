/* gallery-loader.js — reads from IndexedDB and populates pages */
async function loadPageFiles(cat, opts) {
  if (!window.PB) { console.warn('PB not ready'); return; }
  const all  = await PB.getAll(cat);
  const imgs = all.filter(f => f.type?.startsWith('image'));
  const vids = all.filter(f => f.type?.startsWith('video'));

  // Image gallery
  if (opts.gallery) {
    const el = document.getElementById(opts.gallery);
    if (el && imgs.length) {
      el.innerHTML = imgs.map(f => `
        <div class="g-item" data-cat="${f.tags?.[0] || 'all'}">
          <img src="${f.data}" alt="${f.name}" loading="lazy"/>
          <div class="g-item-overlay">
            <div class="g-item-info">
              <h4>${f.name.replace(/\.[^.]+$/, '')}</h4>
              <p>${(f.tags || [cat]).join(', ')}</p>
            </div>
          </div>
        </div>`).join('');
    }
  }

  // Horizontal strip
  if (opts.strip && imgs.length) {
    const el = document.getElementById(opts.strip);
    if (el) el.innerHTML = imgs.map(f => `
      <div class="g-strip-item">
        <img src="${f.data}" alt="${f.name}" loading="lazy"/>
      </div>`).join('');
  }

  // Film strip frames
  if (opts.filmStrip && imgs.length) {
    const el = document.getElementById(opts.filmStrip);
    if (el) el.innerHTML = imgs.map(f => `
      <div class="f-frame">
        <img src="${f.data}" alt="${f.name}" loading="lazy"/>
      </div>`).join('');
  }

  // Video grid
  if (opts.videos && vids.length) {
    const el = document.getElementById(opts.videos);
    if (el) el.innerHTML = vids.map(f => `
      <div class="v-card" onclick="openVideo('${f.data}')">
        <div class="v-thumb">
          <video src="${f.data}" muted preload="metadata"></video>
          <div class="v-play"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
        </div>
        <div class="v-info">
          <h4>${f.name.replace(/\.[^.]+$/, '')}</h4>
          <p>${(f.tags || []).join(', ') || cat}</p>
          <div class="v-meta"><span class="v-tag">${cat}</span></div>
        </div>
      </div>`).join('');
  }

  // Showreel
  if (opts.reel && vids.length) {
    const el = document.getElementById(opts.reel);
    if (el) {
      const sr = vids.find(f => (f.tags || []).includes('showreel')) || vids[0];
      el.innerHTML = `<video src="${sr.data}" controls style="width:100%;height:100%;object-fit:cover"></video>`;
      const ph = document.getElementById(opts.reelPh);
      if (ph) ph.style.display = 'none';
    }
  }

  // Webdev screenshots → project cards
  if (opts.projects && imgs.length) {
    const el = document.getElementById(opts.projects);
    if (el) el.innerHTML = imgs.map((f, i) => `
      <div class="w-proj-card" data-num="0${i+1}">
        <div class="w-proj-url">// project_0${i+1}</div>
        <h3 class="w-proj-name">${f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g,' ')}</h3>
        <div class="w-proj-tags">${(f.tags||[]).map(t=>`<span class="w-proj-tag">${t}</span>`).join('') || '<span class="w-proj-tag">web dev</span>'}</div>
        <div class="w-proj-screen"><img src="${f.data}" alt="${f.name}"/></div>
      </div>`).join('');
  }
}
