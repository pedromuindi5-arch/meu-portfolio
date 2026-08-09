/**
 * project-view.js
 * Renderiza a página dedicada de um projeto (projeto.html?id=...)
 * a partir dos blocos de conteúdo guardados em `projects.blocks`.
 * Estrutura da página: white background, top-bar com X fechar,
 * blocos de imagem em cima, informações do projeto em baixo (estilo Behance).
 */
(function () {
  'use strict';

  const loadingEl = document.getElementById('projectLoading');
  const contentEl = document.getElementById('projectContent');

  const projectCat   = document.getElementById('projectCat');
  const projectTitle = document.getElementById('projectTitle');
  const projectDesc  = document.getElementById('projectDesc');
  const projectYear  = document.getElementById('projectYear');
  const projectTags  = document.getElementById('projectTags');
  const blocksWrap   = document.getElementById('projectBlocks');

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
    renderBlocks(project.blocks || [], project);
    renderInfo(project);

    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
  }

  function showError(message) {
    loadingEl.innerHTML = `<p style="text-align:center;color:#64748b;padding:3rem;">${message} <a href="portfolio.html" style="color:#0f172a;text-decoration:underline;">Voltar ao portfólio</a></p>`;
  }

  function renderInfo(project) {
    const catLabel = typeof getCategoryLabel === 'function' ? getCategoryLabel(project.category) : (project.category || '');

    if (projectCat) projectCat.textContent = catLabel;
    if (projectTitle) projectTitle.textContent = project.title;

    if (projectYear && project.year) {
      projectYear.textContent = project.year;
    }

    if (projectDesc && project.description) {
      projectDesc.textContent = project.description;
      projectDesc.style.display = 'block';
    }

    if (projectTags && project.tags && project.tags.length > 0) {
      projectTags.innerHTML = project.tags.map(t =>
        `<span class="project-detail-tag">${escapeHtml(t)}</span>`
      ).join('');
    }
  }

  function renderBlocks(blocks, project) {
    blocksWrap.innerHTML = '';

    if (!blocks || blocks.length === 0) {
      // Fallback: render cover + images
      const allImgs = [];
      if (project.cover_image) allImgs.push(project.cover_image);
      if (project.images && project.images.length > 0) {
        project.images.forEach(img => { if (img && img !== project.cover_image) allImgs.push(img); });
      }
      if (allImgs.length > 0) {
        allImgs.forEach(url => {
          const fig = document.createElement('figure');
          fig.className = 'project-block-image';
          fig.innerHTML = `<img src="${escapeHtml(url)}" alt="${escapeHtml(project.title)}" loading="lazy">`;
          blocksWrap.appendChild(fig);
        });
      }
      return;
    }

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

  const SPACING = { none: '0', small: '1.5rem', medium: '3rem', large: '5rem' };

  function buildGridBlock(block) {
    const cols = block.columns || 2;
    const wrap = document.createElement('div');
    wrap.className = `project-block-grid grid-cols-${cols}`;
    wrap.style.marginBottom = SPACING[block.spacing] || SPACING.medium;
    wrap.innerHTML = block.images.map(url => `<img src="${escapeHtml(url)}" alt="" loading="lazy">`).join('');
    return wrap;
  }

  function buildImageBlock(block) {
    const fig = document.createElement('figure');
    fig.className = 'project-block-image';
    fig.style.marginBottom = SPACING[block.spacing] || SPACING.medium;
    fig.innerHTML = `
      <img src="${escapeHtml(block.url)}" alt="${escapeHtml(block.caption || '')}" loading="lazy">
      ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}
    `;
    return fig;
  }

  function buildTextBlock(block) {
    const div = document.createElement('div');
    div.className = 'project-block-text';
    div.style.marginBottom = SPACING[block.spacing] || SPACING.medium;
    const p = document.createElement('p');
    p.textContent = block.content;
    div.appendChild(p);
    return div;
  }

  function buildCarouselBlock(block) {
    const wrap = document.createElement('div');
    wrap.className = 'project-block-carousel';
    wrap.style.marginBottom = SPACING[block.spacing] || SPACING.medium;

    const slides = block.images.map(url => `
      <div class="carousel-slide"><img src="${escapeHtml(url)}" alt="" loading="lazy"></div>
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

    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const idx = currentIndex();
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }, 80);
    }, { passive: true });

    // Arrastar horizontalmente (desktop)
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

    function endDrag() {
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
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  init();
})();
