/**
 * category-filter-bar.js
 * Usado nas páginas dedicadas (branding, campanhas, social-media-design,
 * eventos, materiais-graficos, web-design). O botão da categoria atual já
 * vem marcado como "active" no HTML; clicar noutro navega para a página
 * correspondente, mantendo a barra sempre visível (em vez de desaparecer).
 */
(function () {
  'use strict';

  const CATEGORY_PAGES = {
    'all':                  'portfolio.html',
    'identidade-visual':    'branding.html',
    'design-publicitario':  'campanhas.html',
    'social-media':         'social-media-design.html',
    'design-eventos':       'eventos.html',
    'materiais-graficos':   'materiais-graficos.html',
    'web-design':           'web-design.html',
  };

  document.querySelectorAll('.portfolio-filter-clean').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return; // já estamos nesta categoria
      const page = CATEGORY_PAGES[btn.dataset.filter];
      if (page) window.location.href = page;
    });
  });
})();
