/**
 * data.js — Portfolio Data Manager
 * Lucas Muindi Portfolio
 * Stores and manages projects via localStorage
 */

const DB_KEY = 'lucas_muindi_portfolio';

/* ═══════════════════════════
   CATEGORY DEFINITIONS
═══════════════════════════ */
const CATEGORIES = [
  { slug: 'identidade-visual',    label: 'Identidade Visual' },
  { slug: 'social-media',         label: 'Social Media' },
  { slug: 'motion',               label: 'Motion' },
  { slug: 'editorial',            label: 'Editorial' },
  { slug: 'web-design',           label: 'Web Design' },
  { slug: 'embalagem',            label: 'Embalagem' },
  /* Novas categorias — páginas de serviço dedicadas (não alteram os filtros da home) */
  { slug: 'design-publicitario',  label: 'Design Publicitário' },
  { slug: 'design-eventos',       label: 'Design para Eventos' },
  { slug: 'materiais-graficos',   label: 'Materiais Gráficos' },
];

/* ═══════════════════════════
   DEFAULT/SEED PROJECTS
   (used on first load only)
═══════════════════════════ */
const DEFAULT_PROJECTS = [
  {
    id: 'proj-001',
    title: 'Marca Gourmet — Identidade Completa',
    category: 'identidade-visual',
    description: 'Desenvolvimento completo de identidade visual para restaurante gourmet de alta gastronomia. Logo, paleta cromática, tipografia, papelaria e aplicações digitais e físicas.',
    client: 'Restaurante Epicure',
    year: '2024',
    images: [
      'https://picsum.photos/seed/brand1/900/600',
      'https://picsum.photos/seed/brand2/900/600',
      'https://picsum.photos/seed/brand3/900/600',
    ],
    visible: true,
    order: 0
  },
  {
    id: 'proj-002',
    title: 'Rebranding — Studio de Arquitectura',
    category: 'identidade-visual',
    description: 'Reimaginação completa da identidade visual para estúdio de arquitectura contemporânea. Identidade minimalista, sofisticada e atemporal.',
    client: 'FORM Studio',
    year: '2024',
    images: [
      'https://picsum.photos/seed/arch1/900/600',
      'https://picsum.photos/seed/arch2/900/600',
    ],
    visible: true,
    order: 1
  },
  {
    id: 'proj-003',
    title: 'Feed de Instagram — Marca de Moda',
    category: 'social-media',
    description: 'Criação de conteúdo mensal para Instagram de marca de moda sustentável. Estratégia visual coesa, templates e diretrizes de conteúdo.',
    client: 'Verde Wear',
    year: '2024',
    images: [
      'https://picsum.photos/seed/social1/900/600',
      'https://picsum.photos/seed/social2/900/600',
    ],
    visible: true,
    order: 2
  },
  {
    id: 'proj-004',
    title: 'Campanha Digital — Lançamento de Produto',
    category: 'social-media',
    description: 'Campanha completa de lançamento para produto de cosmética natural. Peças para Stories, Reels e feed, com animações e estáticas.',
    client: 'Puré Cosmetics',
    year: '2023',
    images: [
      'https://picsum.photos/seed/cosm1/900/600',
      'https://picsum.photos/seed/cosm2/900/600',
    ],
    visible: true,
    order: 3
  },
  {
    id: 'proj-005',
    title: 'Intro Animada — Podcast de Negócios',
    category: 'motion',
    description: 'Abertura animada para podcast de negócios e empreendedorismo. Motion design, animação tipográfica e identidade sonora visual.',
    client: 'Podcast Impacto',
    year: '2024',
    images: [
      'https://picsum.photos/seed/motion1/900/600',
      'https://picsum.photos/seed/motion2/900/600',
    ],
    visible: true,
    order: 4
  },
  {
    id: 'proj-006',
    title: 'Revista Lookbook — Colecção SS25',
    category: 'editorial',
    description: 'Design editorial de lookbook para colecção primavera/verão. Layout sofisticado, direcção de arte e tratamento fotográfico.',
    client: 'Maison Akela',
    year: '2024',
    images: [
      'https://picsum.photos/seed/edit1/900/600',
      'https://picsum.photos/seed/edit2/900/600',
    ],
    visible: true,
    order: 5
  },
  {
    id: 'proj-007',
    title: 'Website — Studio de Fotografia',
    category: 'web-design',
    description: 'Design e prototipagem de website para studio de fotografia comercial. UX/UI focado na apresentação editorial do portfólio.',
    client: 'Lux Studio',
    year: '2023',
    images: [
      'https://picsum.photos/seed/web1/900/600',
      'https://picsum.photos/seed/web2/900/600',
    ],
    visible: true,
    order: 6
  },
  {
    id: 'proj-008',
    title: 'Embalagem Premium — Linha de Chás',
    category: 'embalagem',
    description: 'Design de embalagem premium para linha de chás artesanais de origem africana. Ilustrações personalizadas, dourado e paleta terrosa.',
    client: 'Bora Tea Co.',
    year: '2024',
    images: [
      'https://picsum.photos/seed/pack1/900/600',
      'https://picsum.photos/seed/pack2/900/600',
    ],
    visible: true,
    order: 7
  },
];

/* ═══════════════════════════
   DATA ACCESS FUNCTIONS
═══════════════════════════ */

/**
 * Load all projects from localStorage.
 * If none exist, seed with defaults.
 */
function getProjects() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    saveProjects(DEFAULT_PROJECTS);
    return DEFAULT_PROJECTS;
  }
  return JSON.parse(raw);
}

/**
 * Save projects array to localStorage.
 */
function saveProjects(projects) {
  localStorage.setItem(DB_KEY, JSON.stringify(projects));
}

/**
 * Get only visible projects, sorted by order.
 */
function getVisibleProjects() {
  return getProjects()
    .filter(p => p.visible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get projects filtered by category slug.
 * 'all' returns all visible projects.
 */
function getProjectsByCategory(categorySlug) {
  const projects = getVisibleProjects();
  if (categorySlug === 'all') return projects;
  return projects.filter(p => p.category === categorySlug);
}

/**
 * Get a single project by ID.
 */
function getProjectById(id) {
  return getProjects().find(p => p.id === id) || null;
}

/**
 * Add a new project.
 */
function addProject(data) {
  const projects = getProjects();
  const newProject = {
    id: 'proj-' + Date.now(),
    visible: true,
    featured: true,
    order: projects.length,
    ...data
  };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
}

/**
 * Update an existing project by ID.
 */
function updateProject(id, data) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return false;
  projects[idx] = { ...projects[idx], ...data };
  saveProjects(projects);
  return true;
}

/**
 * Delete a project by ID.
 */
function deleteProject(id) {
  let projects = getProjects();
  projects = projects.filter(p => p.id !== id);
  // Re-index order
  projects.forEach((p, i) => { p.order = i; });
  saveProjects(projects);
}

/**
 * Toggle visibility of a project.
 */
function toggleProjectVisibility(id) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;
  projects[idx].visible = !projects[idx].visible;
  saveProjects(projects);
}

/**
 * Move a project up or down in order.
 */
function moveProject(id, direction) {
  const projects = getProjects().sort((a, b) => a.order - b.order);
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= projects.length) return;
  [projects[idx].order, projects[swapIdx].order] = [projects[swapIdx].order, projects[idx].order];
  saveProjects(projects);
}

/**
 * Export projects data as JSON string.
 */
function exportData() {
  return JSON.stringify(getProjects(), null, 2);
}

/**
 * Import projects from JSON string.
 */
function importData(jsonString) {
  const projects = JSON.parse(jsonString);
  saveProjects(projects);
}

/**
 * Get category label by slug.
 */
function getCategoryLabel(slug) {
  const cat = CATEGORIES.find(c => c.slug === slug);
  return cat ? cat.label : slug;
}

/**
 * Count projects per category.
 */
function getCategoryCounts() {
  const projects = getProjects();
  const counts = { all: projects.length };
  CATEGORIES.forEach(cat => {
    counts[cat.slug] = projects.filter(p => p.category === cat.slug).length;
  });
  return counts;
}
