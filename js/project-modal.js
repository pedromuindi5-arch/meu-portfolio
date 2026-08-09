/**
 * project-modal.js
 * Visualização de projetos no estilo Behance (Modal Overlay sobreposto com fundo branco,
 * botão fechar X fixo no canto superior direito e informações do projeto na parte inferior).
 */
(function () {
  'use strict';

  let modalOverlay = null;
  let modalContainer = null;
  let closeBtn = null;
  let modalHistoryPushed = false;

  window.addEventListener('popstate', () => {
    if (modalOverlay && modalOverlay.classList.contains('open')) {
      closeProjectModal(true);
    }
  });

  function createModalDOM() {
    if (document.getElementById('behanceProjectModal')) return;

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'behanceProjectModal';
    modalOverlay.className = 'behance-modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');

    closeBtn = document.createElement('button');
    closeBtn.className = 'behance-close-btn';
    closeBtn.setAttribute('aria-label', 'Fechar projeto');
    closeBtn.innerHTML = '✕';

    modalContainer = document.createElement('div');
    modalContainer.className = 'behance-modal-container';

    modalOverlay.appendChild(closeBtn);
    modalOverlay.appendChild(modalContainer);
    document.body.appendChild(modalOverlay);

    // Event Listeners para fechar
    closeBtn.addEventListener('click', closeProjectModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  async function openProjectModal(projectId) {
    createModalDOM();
    if (!projectId) return;

    // Se estivermos na página projeto.html, podemos usar este modal ou manter a navegação limpa
    modalContainer.innerHTML = `
      <div style="padding: 5rem 2rem; text-align: center; color: #64748b;">
        <p>A carregar projeto...</p>
      </div>
    `;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (!modalHistoryPushed) {
      history.pushState({ projectModalOpen: true }, '');
      modalHistoryPushed = true;
    }

    const project = await getProjectById(projectId);
    if (!project) {
      modalContainer.innerHTML = `
        <div style="padding: 5rem 2rem; text-align: center; color: #ef4444;">
          <p>Não foi possível carregar este projeto.</p>
        </div>
      `;
      return;
    }

    renderModalContent(project);
  }

  function closeProjectModal(fromPopState = false) {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';

    if (modalHistoryPushed) {
      modalHistoryPushed = false;
      if (!fromPopState) {
        history.back();
      }
    }
  }

  function renderModalContent(project) {
    const catLabel = typeof getCategoryLabel === 'function' ? getCategoryLabel(project.category) : (project.category || '');
    
    // Imagens/Blocos de topo
    let blocksHTML = '';
    const blocks = project.blocks || [];

    if (blocks.length > 0) {
      const SPACING = { none: '0', small: '1.5rem', medium: '3rem', large: '5rem' };
      blocks.forEach(b => {
        const mb = SPACING[b.spacing] || SPACING.medium;
        if (b.type === 'image' && b.url) {
          blocksHTML += `
            <figure style="margin:0 0 ${mb};">
              <img src="${escapeHtml(b.url)}" alt="${escapeHtml(b.caption || project.title)}" loading="lazy">
              ${b.caption ? `<figcaption style="padding:0.75rem 2.5rem;font-size:0.85rem;color:#64748b;text-align:center;">${escapeHtml(b.caption)}</figcaption>` : ''}
            </figure>
          `;
        } else if (b.type === 'text' && b.content) {
          blocksHTML += `<div class="project-block-text" style="margin-bottom:${mb};"><p>${escapeHtml(b.content)}</p></div>`;
        } else if (b.type === 'grid' && b.images && b.images.length > 0) {
          const cols = b.columns || 2;
          blocksHTML += `
            <div class="project-block-grid grid-cols-${cols}" style="padding:0 1.5rem;margin-bottom:${mb};">
              ${b.images.map(imgUrl => `<img src="${escapeHtml(imgUrl)}" alt="" loading="lazy">`).join('')}
            </div>
          `;
        } else if (b.type === 'carousel' && b.images && b.images.length > 0) {
          const slides = b.images.map(imgUrl => `
            <div class="carousel-slide"><img src="${escapeHtml(imgUrl)}" alt="" loading="lazy"></div>
          `).join('');
          const hasMultiple = b.images.length > 1;
          blocksHTML += `
            <div class="project-block-carousel" data-carousel style="padding:0 1.5rem;margin-bottom:${mb};">
              <div class="carousel-track">${slides}</div>
              ${hasMultiple ? `
                <button type="button" class="carousel-arrow prev" aria-label="Anterior">‹</button>
                <button type="button" class="carousel-arrow next" aria-label="Seguinte">›</button>
                <div class="carousel-dots">
                  ${b.images.map((_, i) => `<button type="button" class="carousel-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></button>`).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }
      });
    } else if (project.cover_image || (project.images && project.images.length > 0)) {
      const allImgs = project.images && project.images.length > 0 ? project.images : [project.cover_image];
      blocksHTML = allImgs.map(imgUrl => `<img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(project.title)}" loading="lazy">`).join('');
    }

    const tagsHTML = (project.tags || []).map(t => `<span class="behance-tag">${escapeHtml(t)}</span>`).join('');

    modalContainer.innerHTML = `
      <!-- PARTE SUPERIOR: BLOCOS DE IMAGENS -->
      <div class="behance-blocks-body">
        ${blocksHTML}
      </div>

      <!-- PARTE INFERIOR: CARTÃO DE INFORMAÇÕES DO PROJETO ESTILO BEHANCE -->
      <div class="behance-project-info-card">
        <div class="behance-owner-box">
          <div class="behance-owner-profile">
            <img src="assets/about.jpeg" alt="Lucas Muindi" class="behance-owner-avatar" onerror="this.src='assets/hero.jpeg'">
            <div>
              <div class="behance-owner-name">Lucas Muindi</div>
              <div class="behance-owner-loc">Namibe, Angola • Designer Gráfico</div>
            </div>
          </div>
          <a href="briefing.html" class="btn-clean-dark" style="font-size:0.8rem;padding:0.7rem 1.25rem;border-radius:30px;width:fit-content;">Pedir orçamento ↗</a>
        </div>

        <div class="behance-details-box">
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <span style="font-size:0.75rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#64748b;background:#f1f5f9;padding:0.25rem 0.75rem;border-radius:20px;">${escapeHtml(catLabel)}</span>
            ${project.year ? `<span style="font-size:0.8rem;color:#94a3b8;font-weight:500;">${escapeHtml(String(project.year))}</span>` : ''}
          </div>
          
          <h2 class="behance-project-title">${escapeHtml(project.title)}</h2>

          ${project.description ? `<div class="behance-project-desc">${escapeHtml(project.description)}</div>` : ''}

          ${tagsHTML ? `<div class="behance-meta-tags">${tagsHTML}</div>` : ''}
        </div>
      </div>
    `;

    // Inicializa o comportamento (arrastar, setas, swipe) de cada carrossel presente
    modalContainer.querySelectorAll('[data-carousel]').forEach(initCarousel);
  }

  /* ─── CARROSSEL: arrastar, setas, swipe, dots ──────── */
  function initCarousel(wrap) {
    const track = wrap.querySelector('.carousel-track');
    const prevBtn = wrap.querySelector('.carousel-arrow.prev');
    const nextBtn = wrap.querySelector('.carousel-arrow.next');
    const dots = wrap.querySelectorAll('.carousel-dot');
    const slideCount = wrap.querySelectorAll('.carousel-slide').length;
    if (!prevBtn || !nextBtn) return;

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

  // Exporta globalmente
  window.openProjectModal = openProjectModal;
  window.closeProjectModal = closeProjectModal;
})();
