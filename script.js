/* ============================
   Image gallery & UI logic
   - Builds slides from `images` array
   - Smooth fade slider with autoplay, dots, keyboard, pause-on-hover
   - Fullscreen viewer on click
   ============================ */

(function () {
  /* --------- 1) Image list (13 images) ---------
     Use relative filenames (same folder as index.html).
     If you prefer raw GitHub links, replace these with your raw URLs.
  */
  const images = [
    "photo_2025-11-22_01-33-45.jpg",
    "photo_2025-11-22_01-33-48.jpg",
    "photo_2025-11-22_01-33-50.jpg",
    "photo_2025-11-22_01-33-51.jpg",
    "photo_2025-11-22_01-33-52.jpg",
    "photo_2025-11-22_01-33-53.jpg",
    "photo_2025-11-22_01-33-54.jpg",
    "photo_2025-11-22_01-33-55.jpg",
    "photo_2025-11-22_01-33-56.jpg",
    "photo_2025-11-22_01-33-57.jpg",
    "photo_2025-11-22_01-33-58.jpg",
    "photo_2025-11-22_01-33-59.jpg",
    "photo_2025-11-22_01-34-00.jpg"
  ];

  /* --------- DOM refs --------- */
  const slidesEl = document.getElementById('fadeSlides');
  const dotsWrap = document.getElementById('fsDots');
  const prevBtn = document.getElementById('fsPrev');
  const nextBtn = document.getElementById('fsNext');

  /* Build slides + dots */
  const slides = [];
  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.setAttribute('role','listitem');

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Palak ${i+1}`;
    img.loading = 'lazy';
    slide.appendChild(img);

    // click to open viewer
    img.addEventListener('click', () => openViewer(i));

    slidesEl.appendChild(slide);
    slides.push(slide);

    // dot
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Go to slide ${i+1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dotEls = Array.from(dotsWrap.children);

  /* ---------- Slider state ---------- */
  let current = 0;
  const delay = 3500;
  let autoplayId = null;
  let isHovered = false;

  function show(index) {
    index = (index + slides.length) % slides.length;
    slides.forEach((s,i) => s.classList.toggle('active', i === index));
    dotEls.forEach((d,i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function goTo(index) {
    index = (index + slides.length) % slides.length;
    show(index);
    resetAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  /* keyboard support */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') closeViewer();
  });

  /* hover to pause autoplay (desktop) */
  slidesEl.addEventListener('mouseenter', () => isHovered = true);
  slidesEl.addEventListener('mouseleave', () => isHovered = false);

  function startAutoplay(){
    stopAutoplay();
    autoplayId = setInterval(() => { if (!isHovered) next(); }, delay);
  }
  function stopAutoplay(){ if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } }
  function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

  /* init */
  show(0);
  startAutoplay();

  /* Make slider resilient to window resize (not needed for absolute positioning, but keep for safety) */
  window.addEventListener('resize', () => { /* nothing required here for fade slider */ });

  /* ----------------------------
     Fullscreen viewer
     ---------------------------- */
  const viewer = document.getElementById('viewer');
  const viewerImg = document.getElementById('viewerImg');
  const viewerClose = document.getElementById('viewerClose');
  const viewerPrev = document.getElementById('viewerPrev');
  const viewerNext = document.getElementById('viewerNext');

  function openViewer(idx) {
    viewerImg.src = images[idx];
    viewer.classList.add('show');
    viewer.setAttribute('aria-hidden','false');
    viewerImg.alt = `Palak ${idx+1}`;
    viewer.dataset.index = idx;
    stopAutoplay();
  }

  function closeViewer() {
    viewer.classList.remove('show');
    viewer.setAttribute('aria-hidden','true');
    resetAutoplay();
  }

  function viewerGoto(delta) {
    let idx = parseInt(viewer.dataset.index || current, 10);
    idx = (idx + delta + images.length) % images.length;
    viewer.dataset.index = idx;
    viewerImg.src = images[idx];
  }

  viewerClose.addEventListener('click', closeViewer);
  viewerPrev.addEventListener('click', () => viewerGoto(-1));
  viewerNext.addEventListener('click', () => viewerGoto(+1));

  // click outside image to close
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) closeViewer();
  });

  /* simple swipe detection for viewer (mobile) */
  (function swipeSupport(){
    let startX = 0, startY = 0;
    viewer.addEventListener('touchstart', e => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY;
    }, {passive:true});
    viewer.addEventListener('touchend', e => {
      const t = (e.changedTouches && e.changedTouches[0]) || {};
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) viewerGoto(+1); else viewerGoto(-1);
      }
    }, {passive:true});
  })();

  /* ----------------------------
     Small UI: reveal reasons + surprise popup
     ---------------------------- */
  // Reveal reasons sequentially when "reasons-section" becomes visible
  function revealReasonsOnce() {
    const items = document.querySelectorAll('#reasons-section .reason');
    let delay = 80;
    items.forEach((item,i) => {
      setTimeout(() => item.classList.add('show'), delay * (i+1));
    });
  }
  // Add the .reason elements for compatibility
  (function ensureReasonNodes(){
    const rs = document.querySelector('#reasons-section');
    const existing = rs.querySelectorAll('.reason');
    if (existing.length === 0) {
      // the HTML uses .reason elements already in this rewrite, but keep safe fallback
      const nodes = rs.querySelectorAll('.reason');
      if (nodes.length) revealReasonsOnce();
    } else revealReasonsOnce();
  })();

  // Surprise popup
  const surpriseBtn = document.getElementById('surpriseBtn');
  const popup = document.getElementById('popup');
  surpriseBtn && surpriseBtn.addEventListener('click', () => {
    popup.classList.add('show');
    popup.setAttribute('aria-hidden','false');
    setTimeout(()=> { popup.classList.remove('show'); popup.setAttribute('aria-hidden','true'); }, 2200);
  });

  /* ----------------------------
     Petal + heart animations & loader handling
     (small, minimal versions to keep original feel)
     ---------------------------- */

  // Petals lighter: create simple petal elements (image file is optional)
  function spawnPetal() {
    const p = document.createElement('div');
    p.className = 'petal'; // style is now minimal in CSS, keeps usage from old file if present
    // optional visual: use small circle
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '-10px';
    p.style.width = (12 + Math.random()*10) + 'px';
    p.style.height = p.style.width;
    p.style.borderRadius = '50%';
    p.style.background = 'rgba(255,150,190,0.85)';
    p.style.opacity = (0.6 + Math.random()*0.3);
    p.style.pointerEvents = 'none';
    p.style.position = 'fixed';
    document.body.appendChild(p);
    p.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: p.style.opacity },
      { transform: `translateY(${110 + Math.random()*40}vh) rotate(${Math.random()*360}deg)`, opacity: 0 }
    ], { duration: 3500 + Math.random()*2500, easing:'linear' });
    setTimeout(()=> p.remove(), 6500);
  }
  setInterval(spawnPetal, 900);

  // Loader fadeout on page load
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.opacity = '0';
    setTimeout(()=> { loader.style.display = 'none'; }, 1200);
  });

})();
