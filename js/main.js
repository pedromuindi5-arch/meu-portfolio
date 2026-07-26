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
  const statNums = document.querySelectorAll('.stat-num');
  const aboutPhoto = document.getElementById('aboutPhoto');

  let currentFilter = 'all';

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

    const imgSrc = project.cover_image || (project.images && project.images[0]) || '';
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

    const open = () => {
      if (typeof window.openProjectModal === 'function') {
        window.openProjectModal(project.id);
      } else {
        window.location.href = `projeto.html?id=${project.id}`;
      }
    };
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

  /* ─── INIT ─────────────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  renderProjects('all');

})();