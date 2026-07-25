/**
 * project-view.js
 * Renderiza a página dedicada de um projeto (projeto.html?id=...)
 * a partir dos blocos de conteúdo guardados em `projects.blocks`.
 */
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  const loadingEl = document.getElementById('projectLoading');
  const contentEl = document.getElementById('projectContent');
  const heroCat = document.getElementById('projectHeroCat');
  const heroTitle = document.getElementById('projectHeroTitle');
  const heroDesc = document.getElementById('projectHeroDesc');
  const heroTags = document.getElementById('projectHeroTags');
  const heroInfo = document.getElementById('projectHeroInfo');
  const blocksWrap = document.getElementById('projectBlocks');

  /* ─── NAVBAR / MOBILE MENU (igual ao resto do site) ─── */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

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

  /* ─── CARREGAR PROJETO ──────────────────────────────── */
  async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
      showError('Projeto não especificado.');
      return;
    }

    const project = await getProjectById(id);
    if (!project) {
      showError('Este projeto não foi encontrado ou já não está disponível.');
      return;
    }

    document.title = `${project.title} — Lucas Muindi`;
    renderHero(project);
    renderBlocks(project.blocks || []);

    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
  }

  function showError(message) {
    loadingEl.innerHTML = `<p>${message} <a href="portfolio.html" style="color:var(--text);text-decoration:underline;">Voltar ao portfólio</a></p>`;
  }

  function renderHero(project) {
    heroCat.textContent = getCategoryLabel(project.category);
    heroTitle.textContent = project.title;

    if (project.description) {
      heroDesc.textContent = project.description;
      heroDesc.style.display = 'block';
    }

    if (project.tags && project.tags.length > 0) {
      heroTags.innerHTML = project.tags.map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('');
      heroTags.style.display = 'flex';
    }

    const infoItems = [];
    if (project.client) infoItems.push(['Cliente', project.client]);
    if (project.year) infoItems.push(['Ano', project.year]);
    if (infoItems.length > 0) {
      heroInfo.innerHTML = infoItems.map(([label, value]) => `
        <div class="project-hero-info-item">
          <span class="project-hero-info-label">${label}</span>
          <span class="project-hero-info-value">${escapeHtml(String(value))}</span>
        </div>
      `).join('');
      heroInfo.style.display = 'flex';
    }
  }

  function renderBlocks(blocks) {
    blocksWrap.innerHTML = '';
    if (!blocks || blocks.length === 0) return;

    blocks.forEach(block => {
      let el;
      if (block.type === 'image' && block.url) {
        el = buildImageBlock(block);
      } else if (block.type === 'text' && block.content) {
        el = buildTextBlock(block);
      } else if (block.type === 'carousel' && block.images && block.images.length > 0) {
        el = buildCarouselBlock(block);
      } else if (block.type === 'grid' && block.images && block.images.length > 0) {
        el = buildGridBlock(block);
      }
      if (el) blocksWrap.appendChild(el);
    });
  }

  function buildGridBlock(block) {
    const cols = block.columns || 2;
    const wrap = document.createElement('div');
    wrap.className = `project-block-grid grid-cols-${cols}`;
    wrap.innerHTML = block.images.map(url => `<img src="${url}" alt="" loading="lazy">`).join('');
    return wrap;
  }

  function buildImageBlock(block) {
    const fig = document.createElement('figure');
    fig.className = 'project-block-image';
    fig.innerHTML = `
      <img src="${block.url}" alt="${escapeHtml(block.caption || '')}" loading="lazy">
      ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}
    `;
    return fig;
  }

  function buildTextBlock(block) {
    const div = document.createElement('div');
    div.className = 'project-block-text';
    const p = document.createElement('p');
    p.textContent = block.content;
    div.appendChild(p);
    return div;
  }

  function buildCarouselBlock(block) {
    const wrap = document.createElement('div');
    wrap.className = 'project-block-carousel';

    const slides = block.images.map(url => `
      <div class="carousel-slide"><img src="${url}" alt="" loading="lazy"></div>
    `).join('');

    const hasMultiple = block.images.length > 1;

    wrap.innerHTML = `
      <div class="carousel-track">${slides}</div>
      ${hasMultiple ? `
        <button type="button" class="carousel-arrow prev" aria-label="Anterior">‹</button>
        <button type="button" class="carousel-arrow next" aria-label="Seguinte">›</button>
        <div class="carousel-dots">
          ${block.images.map((_, i) => `<button type="button" class="carousel-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></button>`).join('')}
        </div>
      ` : ''}
    `;

    if (hasMultiple) initCarousel(wrap);
    return wrap;
  }

  /* ─── CARROSSEL: arrastar, setas, swipe, dots ──────── */
  function initCarousel(wrap) {
    const track = wrap.querySelector('.carousel-track');
    const prevBtn = wrap.querySelector('.carousel-arrow.prev');
    const nextBtn = wrap.querySelector('.carousel-arrow.next');
    const dots = wrap.querySelectorAll('.carousel-dot');
    const slideCount = wrap.querySelectorAll('.carousel-slide').length;

    function goTo(idx) {
      idx = Math.max(0, Math.min(idx, slideCount - 1));
      track.scrollTo({ left: track.clientWidth * idx, behavior: 'smooth' });
    }

    function currentIndex() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex() - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex() + 1));
    dots.forEach(dot => dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx, 10))));

    // Atualiza os dots ao fazer scroll (swipe mobile ou drag)
    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const idx = currentIndex();
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }, 80);
    }, { passive: true });

    // Arrastar horizontalmente com o rato (desktop)
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    track.addEventListener('pointerdown', (e) => {
      isDown = true;
      track.classList.add('dragging');
      startX = e.clientX;
      scrollStart = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      track.scrollLeft = scrollStart - dx;
    });

    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('dragging');
      goTo(currentIndex());
    }

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', () => { if (isDown) endDrag(); });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  init();
})();
