/**
 * service-page.js
 * Script partilhado pelas páginas de serviço dedicadas
 * (branding, campanhas, social-media-design, eventos, materiais-graficos, web-design).
 *
 * Cada página define, no grid da galeria, o atributo:
 *   data-category="slug-da-categoria"
 * e este script trata do resto: nav, menu mobile e render da galeria.
 * Clicar num projeto leva à página dedicada projeto.html?id=...
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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

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

    const imgSrc = project.cover_image || (project.images && project.images[0]) || '';
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

    const open = () => { window.location.href = `projeto.html?id=${project.id}`; };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(); });

    return card;
  }

  /* ─── INIT ─────────────────────────────────────────── */
  renderGallery();
})();
