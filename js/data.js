/**
 * data.js — Portfolio Data Manager
 * Lucas Muindi Portfolio
 * Agora ligado ao Supabase (tabela `projects` + bucket `project-images`).
 * Todas as funções que acedem à base de dados são assíncronas (retornam Promises).
 */

/* ═══════════════════════════
   CATEGORY DEFINITIONS
   (estático — não precisa de ir à base de dados)
═══════════════════════════ */
const CATEGORIES = [
  { slug: 'identidade-visual',    label: 'Identidade Visual' },
  { slug: 'design-publicitario',  label: 'Design Publicitário' },
  { slug: 'social-media',         label: 'Social Media' },
  { slug: 'design-eventos',       label: 'Design para Eventos' },
  { slug: 'materiais-graficos',   label: 'Materiais Gráficos' },
  { slug: 'web-design',           label: 'Web Design' },
];

/**
 * Get category label by slug. (síncrono)
 */
function getCategoryLabel(slug) {
  const cat = CATEGORIES.find(c => c.slug === slug);
  return cat ? cat.label : slug;
}

/* ═══════════════════════════
   PROJECTS — CRUD (Supabase)
═══════════════════════════ */

/**
 * Todos os projetos que o utilizador autenticado (admin) pode ver,
 * ordenados por sort_order. Visitantes só veem os visíveis (via RLS).
 */
async function getProjects() {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Erro ao carregar projetos:', error);
    return [];
  }
  return data.map(normalizeProject);
}

/**
 * Só projetos visíveis, ordenados. Usado no site público.
 */
async function getVisibleProjects() {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Erro ao carregar projetos:', error);
    return [];
  }
  return data.map(normalizeProject);
}

/**
 * Get projects filtered by category slug.
 * 'all' returns all visible projects.
 */
async function getProjectsByCategory(categorySlug) {
  const projects = await getVisibleProjects();
  if (categorySlug === 'all') return projects;
  return projects.filter(p => p.category === categorySlug);
}

/**
 * Get a single project by ID.
 */
async function getProjectById(id) {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Erro ao carregar projeto:', error);
    return null;
  }
  return normalizeProject(data);
}

/**
 * Add a new project. `data` = { title, category, client, year, description, visible, featured, images }
 */
async function addProject(data) {
  const projects = await getProjects();
  const payload = {
    title: data.title,
    category: data.category,
    client: data.client || null,
    year: data.year ? parseInt(data.year, 10) : null,
    description: data.description || '',
    images: data.images || [],
    cover_image: data.cover_image || (data.images && data.images[0]) || null,
    tags: data.tags || [],
    blocks: data.blocks || [],
    visible: data.visible !== false,
    featured: data.featured !== false,
    sort_order: projects.length,
  };
  const { data: inserted, error } = await supabaseClient
    .from('projects')
    .insert(payload)
    .select()
    .single();
  if (error) {
    console.error('Erro ao adicionar projeto:', error);
    throw error;
  }
  return normalizeProject(inserted);
}

/**
 * Update an existing project.
 */
async function updateProject(id, data) {
  const payload = {
    title: data.title,
    category: data.category,
    client: data.client || null,
    year: data.year ? parseInt(data.year, 10) : null,
    description: data.description || '',
    images: data.images || [],
    cover_image: data.cover_image || (data.images && data.images[0]) || null,
    tags: data.tags || [],
    blocks: data.blocks || [],
    visible: data.visible !== false,
    featured: data.featured !== false,
  };
  const { error } = await supabaseClient
    .from('projects')
    .update(payload)
    .eq('id', id);
  if (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
}

/**
 * Delete a project.
 */
async function deleteProject(id) {
  const { error } = await supabaseClient
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Erro ao eliminar projeto:', error);
    throw error;
  }
}

/**
 * Move a project up/down (troca sort_order com o vizinho).
 */
async function moveProject(id, direction) {
  const projects = await getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= projects.length) return;

  const a = projects[idx];
  const b = projects[swapIdx];

  await Promise.all([
    supabaseClient.from('projects').update({ sort_order: b.sort_order }).eq('id', a.id),
    supabaseClient.from('projects').update({ sort_order: a.sort_order }).eq('id', b.id),
  ]);
}

/**
 * Toggle project visibility.
 */
async function toggleProjectVisibility(id) {
  const p = await getProjectById(id);
  if (!p) return;
  const { error } = await supabaseClient
    .from('projects')
    .update({ visible: !p.visible })
    .eq('id', id);
  if (error) console.error('Erro ao atualizar visibilidade:', error);
}

/**
 * Count projects per category.
 */
async function getCategoryCounts() {
  const projects = await getProjects();
  const counts = { all: projects.length };
  CATEGORIES.forEach(cat => {
    counts[cat.slug] = projects.filter(p => p.category === cat.slug).length;
  });
  return counts;
}

/* ═══════════════════════════
   BRIEFINGS (leads recebidos via briefing.html)
═══════════════════════════ */

/**
 * Devolve todos os briefings, mais recentes primeiro.
 */
async function getBriefings() {
  const { data, error } = await supabaseClient
    .from('briefings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Erro ao carregar briefings:', error);
    return [];
  }
  return data;
}

/**
 * Atualiza o estado de um briefing (novo / em_andamento / concluido).
 */
async function updateBriefingStatus(id, status) {
  const { error } = await supabaseClient
    .from('briefings')
    .update({ status })
    .eq('id', id);
  if (error) {
    console.error('Erro ao atualizar estado do briefing:', error);
    throw error;
  }
}

/* ═══════════════════════════
   SERVICE DOCUMENTS (conteúdo dos PDFs de boas-vindas)
═══════════════════════════ */

/**
 * Devolve todos os documentos de serviço.
 */
async function getServiceDocuments() {
  const { data, error } = await supabaseClient
    .from('service_documents')
    .select('*')
    .order('service_type', { ascending: true });
  if (error) {
    console.error('Erro ao carregar documentos de serviço:', error);
    return [];
  }
  return data;
}

/**
 * Devolve um documento de serviço específico.
 */
async function getServiceDocument(serviceType) {
  const { data, error } = await supabaseClient
    .from('service_documents')
    .select('*')
    .eq('service_type', serviceType)
    .single();
  if (error) {
    console.error('Erro ao carregar documento de serviço:', error);
    return null;
  }
  return data;
}

/**
 * Atualiza um documento de serviço.
 */
async function updateServiceDocument(serviceType, data) {
  const payload = {
    title: data.title,
    welcome_message: data.welcome_message,
    includes: data.includes || [],
    delivery_time: data.delivery_time || null,
    revisions: data.revisions || null,
    payment_method: data.payment_method || null,
    next_steps: data.next_steps || [],
  };
  const { error } = await supabaseClient
    .from('service_documents')
    .update(payload)
    .eq('service_type', serviceType);
  if (error) {
    console.error('Erro ao atualizar documento de serviço:', error);
    throw error;
  }
}

/* ═══════════════════════════
   IMAGES — Supabase Storage
═══════════════════════════ */

/**
 * Faz upload de um ficheiro de imagem para o bucket `project-images`
 * e devolve o URL público.
 */
async function uploadProjectImage(file) {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabaseClient
    .storage
    .from('project-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
  const { data } = supabaseClient.storage.from('project-images').getPublicUrl(path);
  return data.publicUrl;
}

/* ═══════════════════════════
   EXPORT / IMPORT (backup em JSON)
═══════════════════════════ */

async function exportData() {
  const projects = await getProjects();
  return JSON.stringify({ projects, exportedAt: new Date().toISOString() }, null, 2);
}

async function importData(jsonString) {
  const parsed = JSON.parse(jsonString);
  if (!parsed.projects || !Array.isArray(parsed.projects)) {
    throw new Error('Formato de importação inválido.');
  }
  for (const p of parsed.projects) {
    await addProject(p);
  }
}

/* ═══════════════════════════
   HELPERS
═══════════════════════════ */

function normalizeProject(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    client: row.client,
    year: row.year,
    description: row.description,
    images: row.images || [],
    cover_image: row.cover_image || (row.images && row.images[0]) || null,
    tags: row.tags || [],
    blocks: row.blocks || [],
    visible: row.visible,
    featured: row.featured,
    order: row.sort_order,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}
