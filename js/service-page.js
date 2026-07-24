/**
 * service-page.js
 * Script partilhado pelas páginas de serviço dedicadas
 * (branding, campanhas, social-media-design, eventos, materiais-graficos).
 *
 * Cada página define, no grid da galeria, o atributo:
 *   data-category="slug-da-categoria"
 * e este script trata do resto: nav, menu mobile, render da galeria e modal.
 */
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  const grid = document.getElementById('serviceGrid');
  const emptyState = document.getElementById('emptyState');
  const modalOverlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  let galleryIndex = 0;
  let galleryImages = [];

  /* ─── NAVBAR SCROLL ────────────────────────────────── */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  /* ─── MOBILE MENU ──────────────────────────────────── */
  const openMenu = () => {
    mobileOverlay.classList.add('open');
    menuBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileOverlay.classList.remove('open');
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ─── GALLERY RENDER ───────────────────────────────── */
  async function renderGallery() {
    if (!grid) return;
    const categorySlug = grid.dataset.category;
    const projects = await getProjectsByCategory(categorySlug);
    grid.innerHTML = '';

    if (!projects.length) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';

    projects.forEach((p, idx) => grid.appendChild(createCard(p, idx)));
  }

  function createCard(project, idx) {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.style.animationDelay = `${idx * 0.06}s`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver projecto: ${project.title}`);

    const imgSrc = project.images && project.images[0] ? project.images[0] : '';
    const catLabel = getCategoryLabel(project.category);

    card.innerHTML = `
      ${imgSrc
        ? `<img src="${imgSrc}" alt="${project.title}" loading="lazy">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a1a;font-size:0.8rem;color:var(--text-muted)">SEM IMAGEM</div>`
      }
      <div class="portfolio-card-overlay">
        <span class="portfolio-card-cat">${catLabel}</span>
        <span class="portfolio-card-title">${project.title}</span>
      </div>
    `;

    const open = () => openModal(project);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(); });

    return card;
  }

  /* ─── MODAL ────────────────────────────────────────── */
  function openImageInNewTab(imgUrl) {
    if (imgUrl.startsWith('data:')) {
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${imgUrl}" style="max-width:100%; height:auto;">`;
      newTab.document.title = 'Visualização de Imagem';
    } else {
      window.open(imgUrl, '_blank');
    }
  }

  function openModal(project) {
    galleryImages = project.images || [];
    galleryIndex = 0;

    const catLabel = getCategoryLabel(project.category);

    let galleryHTML = '';
    if (galleryImages.length > 0) {
      const slides = galleryImages.map(img =>
        `<div class="modal-gallery-slide"><img src="${img}" alt="${project.title}" loading="lazy" onclick="window.open('${img}', '_blank')"></div>`
      ).join('');
      const dots = galleryImages.length > 1
        ? `<div class="modal-gallery-dots">${galleryImages.map((_, i) =>
          `<span class="modal-gallery-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`
        ).join('')}</div>`
        : '';
      const navBtns = galleryImages.length > 1
        ? `<button class="modal-gallery-nav prev" id="galPrev">‹</button>
           <button class="modal-gallery-nav next" id="galNext">›</button>`
        : '';
      galleryHTML = `
        <div class="modal-gallery">
          <div class="modal-gallery-track" id="galTrack">${slides}</div>
          ${navBtns}
          ${dots}
          <div class="modal-fullscreen-btn" id="fullViewBtn">Ver em tamanho real ↗</div>
        </div>
      `;
    }

    modalBody.innerHTML = `
      ${galleryHTML}
      <div class="modal-info">
        <div class="modal-cat">${catLabel}</div>
        <h2 class="modal-title">${project.title}</h2>
        <p class="modal-desc">${project.description}</p>
        <div class="modal-meta">
          ${project.client ? `<div class="modal-meta-item">
            <span class="modal-meta-label">Cliente</span>
            <span class="modal-meta-value">${project.client}</span>
          </div>` : ''}
          ${project.year ? `<div class="modal-meta-item">
            <span class="modal-meta-label">Ano</span>
            <span class="modal-meta-value">${project.year}</span>
          </div>` : ''}
          <div class="modal-meta-item">
            <span class="modal-meta-label">Categoria</span>
            <span class="modal-meta-value">${catLabel}</span>
          </div>
        </div>
      </div>
    `;

    const fullViewBtn = document.getElementById('fullViewBtn');
    if (fullViewBtn && galleryImages[0]) {
      fullViewBtn.onclick = () => openImageInNewTab(galleryImages[galleryIndex]);
    }

    if (galleryImages.length > 1) {
      const track = document.getElementById('galTrack');
      const prevBtn = document.getElementById('galPrev');
      const nextBtn = document.getElementById('galNext');
      const dots = document.querySelectorAll('.modal-gallery-dot');

      const goTo = (idx) => {
        galleryIndex = Math.max(0, Math.min(idx, galleryImages.length - 1));
        track.style.transform = `translateX(-${galleryIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === galleryIndex));
        if (fullViewBtn) fullViewBtn.onclick = () => openImageInNewTab(galleryImages[galleryIndex]);
      };

      prevBtn.addEventListener('click', () => goTo(galleryIndex - 1));
      nextBtn.addEventListener('click', () => goTo(galleryIndex + 1));
      dots.forEach(dot => dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx, 10))));
    }

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeMenu(); }
    if (e.key === 'ArrowLeft' && modalOverlay.classList.contains('open')) {
      const prev = document.getElementById('galPrev');
      if (prev) prev.click();
    }
    if (e.key === 'ArrowRight' && modalOverlay.classList.contains('open')) {
      const next = document.getElementById('galNext');
      if (next) next.click();
    }
  });

  /* ─── INIT ─────────────────────────────────────────── */
  renderGallery();
})();
