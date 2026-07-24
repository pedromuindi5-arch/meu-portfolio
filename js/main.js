/**
 * main.js — Portfolio Site Logic
 * Lucas Muindi Portfolio
 */

(function () {
  'use strict';

  /* ─── DOM REFS ─────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');
  const heroBg = document.getElementById('heroBg');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectsGrid = document.getElementById('projectsGrid');
  const emptyState = document.getElementById('emptyState');
  const modalOverlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');
  const statNums = document.querySelectorAll('.stat-num');
  const aboutPhoto = document.getElementById('aboutPhoto');

  let currentFilter = 'all';
  let galleryIndex = 0;
  let galleryImages = [];

  /* ─── HERO SCROLL PARALLAX (Norell style) ──────────── */
  const heroEl = document.getElementById('hero');
  const heroContent = heroEl.querySelector('.hero-content');
  const heroName = heroEl.querySelector('.hero-name');
  const heroOverlay = heroEl.querySelector('.hero-overlay');

  function updateHeroParallax() {
    const scrollY = window.scrollY;
    const heroH = heroEl.offsetHeight;

    if (scrollY > heroH) return; // past hero — stop calculating

    const progress = scrollY / heroH; // 0 → 1 as you scroll through hero

    // 1. Background moves at 40% of scroll speed (slower = depth)
    heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;

    // 2. Overlay gets darker as you scroll (cinematic reveal)
    const extraDark = progress * 0.45;
    heroOverlay.style.background = `linear-gradient(
      to bottom,
      rgba(9,9,9,${0.35 + extraDark}) 0%,
      rgba(9,9,9,${0.1 + extraDark}) 30%,
      rgba(9,9,9,${0.2 + extraDark}) 60%,
      rgba(9,9,9,${0.85 + extraDark * 0.15}) 100%
    )`;

    // 3. Hero content (tagline + ®) drifts up and fades
    const contentShift = scrollY * 0.5;
    const contentOpacity = Math.max(0, 1 - progress * 2);
    if (heroContent) {
      heroContent.style.transform = `translateY(-${contentShift}px)`;
      heroContent.style.opacity = contentOpacity;
    }

    // 4. Big name rises slightly (subtler effect)
    if (heroName) {
      heroName.style.transform = `translateY(-${scrollY * 0.15}px)`;
    }
  }

  window.addEventListener('scroll', updateHeroParallax, { passive: true });
  // Run once to init
  updateHeroParallax();

  /* ─── NAVBAR SCROLL ────────────────────────────────── */
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

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

  menuBtn.addEventListener('click', () => {
    if (mobileOverlay.classList.contains('open')) closeMenu();
    else openMenu();
  });
  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) closeMenu();
  });
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ─── SMOOTH SCROLL ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ─── REVEAL ON SCROLL (IntersectionObserver) ─────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children slightly
        const siblings = entry.target.parentElement.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
        siblings.forEach((el, i) => {
          if (!el.classList.contains('visible')) {
            setTimeout(() => el.classList.add('visible'), i * 80);
          }
        });
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Trigger hero reveals immediately
  document.querySelectorAll('.hero .reveal-up, .hero .reveal-left, .hero .reveal-right').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 300);
  });

  revealEls.forEach(el => {
    if (!el.closest('.hero')) revealObserver.observe(el);
  });

  /* ─── COUNTER ANIMATION ────────────────────────────── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur = 1500;
    const step = 16;
    const inc = target / (dur / step);
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  /* ─── PROJECTS RENDERING ───────────────────────────── */
  async function renderProjects(filter) {
    // Na Home (main.js), filtramos apenas os projetos que estão em destaque (featured)
    const all = await getProjectsByCategory(filter);
    const projects = all.filter(p => p.featured !== false);
    projectsGrid.innerHTML = '';

    if (projects.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    projects.forEach((p, idx) => {
      const card = createCard(p, idx);
      projectsGrid.appendChild(card);
    });
  }

  function createCard(project, idx) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${idx * 0.06}s`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver projecto: ${project.title}`);

    const imgSrc = project.images && project.images[0] ? project.images[0] : '';
    const catLabel = getCategoryLabel(project.category);

    card.innerHTML = `
      ${imgSrc
        ? `<img src="${imgSrc}" alt="${project.title}" loading="lazy">`
        : `<div class="project-card-placeholder">${project.title.charAt(0)}</div>`
      }
      <div class="project-card-overlay">
        <span class="project-card-cat">${catLabel}</span>
        <span class="project-card-title">${project.title}</span>
        <span class="project-card-btn">Ver projecto</span>
      </div>
    `;

    const open = () => openModal(project);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(); });

    return card;
  }

  /* ─── FILTER ───────────────────────────────────────── */
  const worksMoreLink = document.getElementById('worksMoreLink');
  const worksMoreLinkAnchor = document.getElementById('worksMoreLinkAnchor');

  const CATEGORY_PAGES = {
    'identidade-visual':   'branding.html',
    'design-publicitario': 'campanhas.html',
    'social-media':        'social-media-design.html',
    'design-eventos':      'eventos.html',
    'materiais-graficos':  'materiais-graficos.html',
    'web-design':          'web-design.html',
  };

  function updateWorksMoreLink(filter) {
    if (!worksMoreLink) return;
    const page = CATEGORY_PAGES[filter];
    if (filter === 'all' || !page) {
      worksMoreLink.style.display = 'none';
      return;
    }
    worksMoreLinkAnchor.href = page;
    worksMoreLink.style.display = 'block';
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProjects(currentFilter);
      updateWorksMoreLink(currentFilter);
    });
  });

  /* ─── Abre uma imagem (URL normal ou base64) numa nova aba ─── */
  function openImageInNewTab(imgUrl) {
    if (imgUrl.startsWith('data:')) {
      // Para imagens em base64 (upload local), abrimos numa nova aba de forma compatível
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${imgUrl}" style="max-width:100%; height:auto;">`;
      newTab.document.title = 'Visualização de Imagem';
    } else {
      window.open(imgUrl, '_blank');
    }
  }

  /* ─── MODAL ────────────────────────────────────────── */
  function openModal(project) {
    galleryImages = project.images || [];
    galleryIndex = 0;

    const catLabel = getCategoryLabel(project.category);

    // Build gallery HTML
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

    // Botão "ver em tamanho real" — já aponta para a imagem inicial da galeria
    const fullViewBtn = document.getElementById('fullViewBtn');
    if (fullViewBtn && galleryImages.length > 0) {
      fullViewBtn.onclick = () => openImageInNewTab(galleryImages[galleryIndex]);
    }

    // Gallery navigation
    if (galleryImages.length > 1) {
      const track = document.getElementById('galTrack');
      const prev = document.getElementById('galPrev');
      const next = document.getElementById('galNext');
      const dots = document.querySelectorAll('.modal-gallery-dot');

      const goTo = (idx) => {
        galleryIndex = Math.max(0, Math.min(idx, galleryImages.length - 1));
        track.style.transform = `translateX(-${galleryIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === galleryIndex));

        // Atualiza o link do botão de tamanho real para a imagem atual da galeria
        if (fullViewBtn) {
          fullViewBtn.onclick = () => openImageInNewTab(galleryImages[galleryIndex]);
        }
      };

      prev.addEventListener('click', () => goTo(galleryIndex - 1));
      next.addEventListener('click', () => goTo(galleryIndex + 1));
      dots.forEach(dot => {
        dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx, 10)));
      });
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

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMenu();
    }
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
  renderProjects('all');

})();