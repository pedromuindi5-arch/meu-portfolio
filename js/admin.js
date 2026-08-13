/**
 * admin.js — Admin Panel Logic
 * Lucas Muindi Portfolio
 * Autenticação real via Supabase Auth (Authentication → Users no dashboard).
 */

(function () {
  'use strict';

  /* ─── DOM ─────────────────────────────────────────────── */
  const loginScreen   = document.getElementById('loginScreen');
  const adminPanel    = document.getElementById('adminPanel');
  const loginForm     = document.getElementById('loginForm');
  const loginEmail    = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginError    = document.getElementById('loginError');
  const loginBtn      = document.getElementById('loginBtn');
  const logoutBtn     = document.getElementById('logoutBtn');
  const pageTitle     = document.getElementById('pageTitle');

  // Navigation
  const sidebarLinks  = document.querySelectorAll('.sidebar-link[data-view]');
  const views         = {
    dashboard: document.getElementById('viewDashboard'),
    projects:  document.getElementById('viewProjects'),
    add:       document.getElementById('viewAdd'),
    documents: document.getElementById('viewDocuments'),
    briefings: document.getElementById('viewBriefings'),
  };

  // Dashboard
  const statsGrid     = document.getElementById('statsGrid');
  const recentList    = document.getElementById('recentList');

  // Projects Table
  const projectSearch     = document.getElementById('projectSearch');
  const categoryFilter    = document.getElementById('categoryFilter');
  const projectsTableBody = document.getElementById('projectsTableBody');

  // Form
  const projectForm   = document.getElementById('projectForm');
  const formTitle     = document.getElementById('formTitle');
  const editIdInput   = document.getElementById('editId');
  const projTitle     = document.getElementById('projTitle');
  const projCategory  = document.getElementById('projCategory');
  const projClient    = document.getElementById('projClient');
  const projYear      = document.getElementById('projYear');
  const projDesc      = document.getElementById('projDesc');
  const projVisible   = document.getElementById('projVisible');
  const projFeatured  = document.getElementById('projFeatured');
  const cancelForm    = document.getElementById('cancelForm');
  const saveDraftBtn  = document.getElementById('saveDraftBtn');
  const publishBtn    = document.getElementById('publishBtn');
  const imageUrlList  = document.getElementById('imageUrlList');
  const addUrlBtn     = document.getElementById('addUrlBtn');
  const imagePreviewGrid = document.getElementById('imagePreviewGrid');
  const projTags      = document.getElementById('projTags');
  const tagsPreview   = document.getElementById('tagsPreview');
  const addImageBlockBtn = document.getElementById('addImageBlockBtn');
  const addTextBlockBtn  = document.getElementById('addTextBlockBtn');
  const addCarouselBlockBtn = document.getElementById('addCarouselBlockBtn');
  const addGridBlockBtn = document.getElementById('addGridBlockBtn');
  const blocksList    = document.getElementById('blocksList');
  const blocksEmpty   = document.getElementById('blocksEmpty');

  // Service Documents
  const documentsGrid     = document.getElementById('documentsGrid');
  const documentFormWrap  = document.getElementById('documentFormWrap');
  const documentForm      = document.getElementById('documentForm');
  const documentFormTitle = document.getElementById('documentFormTitle');
  const docServiceType    = document.getElementById('docServiceType');
  const docTitle          = document.getElementById('docTitle');
  const docWelcome        = document.getElementById('docWelcome');
  const docIncludes       = document.getElementById('docIncludes');
  const docDeliveryTime   = document.getElementById('docDeliveryTime');
  const docRevisions      = document.getElementById('docRevisions');
  const docPayment        = document.getElementById('docPayment');
  const docNextSteps      = document.getElementById('docNextSteps');
  const cancelDocumentForm = document.getElementById('cancelDocumentForm');

  // Briefings
  const briefingStatusFilter = document.getElementById('briefingStatusFilter');
  const briefingsTableBody   = document.getElementById('briefingsTableBody');
  const briefingDetailsDialog = document.getElementById('briefingDetailsDialog');
  const briefingDetailsTitle  = document.getElementById('briefingDetailsTitle');
  const briefingDetailsBody   = document.getElementById('briefingDetailsBody');
  const briefingDetailsClose  = document.getElementById('briefingDetailsClose');

  // Image tabs
  const tabUrls    = document.getElementById('tabUrls');
  const tabUpload  = document.getElementById('tabUpload');
  const panelUrls  = document.getElementById('panelUrls');
  const panelUpload = document.getElementById('panelUpload');
  const dropZone   = document.getElementById('dropZone');
  const fileUpload = document.getElementById('fileUpload');
  const uploadPreview = document.getElementById('uploadPreview');

  // Export / Import
  const exportBtn  = document.getElementById('exportBtn');
  const compressImagesBtn = document.getElementById('compressImagesBtn');
  const importFile = document.getElementById('importFile');

  // Confirm Dialog
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmCancel = document.getElementById('confirmCancel');
  const confirmDelete = document.getElementById('confirmDelete');

  // Toast
  const toast = document.getElementById('toast');

  // State
  let pendingDeleteId = null;
  let uploadedImages  = [];   // URLs públicos já enviados para o Supabase Storage
  let uploadsInFlight = 0;    // uploads a decorrer (bloqueia submit do formulário)
  let blocksState     = [];   // blocos de conteúdo do projeto em edição
  let blockIdCounter  = 0;

  /* ══════════════════════════════════════════════════════
     AUTH (Supabase Auth)
  ══════════════════════════════════════════════════════ */
  let isPanelOpen = false;

  function authorize() {
    loginScreen.style.display = 'none';
    adminPanel.style.display  = 'flex';
    if (!isPanelOpen) {
      // Só reinicia para o Dashboard na transição real de "sem sessão" para "com sessão"
      // (login inicial). Reconfirmações de sessão (troca de aba, refresh de token,
      // voltar de um seletor de ficheiros) NÃO devem reiniciar a vista atual.
      isPanelOpen = true;
      showView('dashboard');
    }
  }

  function deauthorize() {
    isPanelOpen = false;
    loginScreen.style.display = 'flex';
    adminPanel.style.display  = 'none';
    loginPassword.value = '';
  }

  // Verifica sessão existente ao carregar a página
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) authorize();
    else deauthorize();
  });

  // Mantém o estado sincronizado se a sessão expirar ou for renovada noutro separador
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session) authorize();
    else deauthorize();
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginBtn.disabled = true;
    loginBtn.textContent = 'A entrar...';
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: loginEmail.value.trim(),
      password: loginPassword.value,
    });
    loginBtn.disabled = false;
    loginBtn.textContent = 'Entrar';
    if (error) {
      loginError.classList.add('show');
      loginPassword.value = '';
      loginPassword.focus();
    } else {
      loginError.classList.remove('show');
      authorize();
    }
  });

  logoutBtn.addEventListener('click', async () => {
    if (confirm('Tens a certeza que queres sair?')) {
      await supabaseClient.auth.signOut();
      deauthorize();
    }
  });

  /* ══════════════════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════════════════ */
  const viewTitles = {
    dashboard: 'Dashboard',
    projects:  'Todos os Projetos',
    add:       'Novo Projeto',
    documents: 'Documentos de Serviço',
    briefings: 'Briefings',
  };

  async function showView(viewName) {
    Object.entries(views).forEach(([name, el]) => {
      el.style.display = name === viewName ? 'block' : 'none';
    });
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });
    pageTitle.textContent = viewTitles[viewName] || viewName;

    if (viewName === 'dashboard') await renderDashboard();
    if (viewName === 'projects')  await renderProjectsTable();
    if (viewName === 'add') {
      resetForm();
    }
    if (viewName === 'documents') {
      documentFormWrap.style.display = 'none';
      await renderDocumentsGrid();
    }
    if (viewName === 'briefings') {
      await renderBriefingsTable();
    }
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => showView(link.dataset.view));
  });

  /* ══════════════════════════════════════════════════════
     DASHBOARD
  ══════════════════════════════════════════════════════ */
  async function renderDashboard() {
    const counts = await getCategoryCounts();

    statsGrid.innerHTML = '';

    // Total first
    const totalCard = makeStatCard(counts.all, 'Total de Projetos');
    statsGrid.appendChild(totalCard);

    // Categories
    CATEGORIES.forEach(cat => {
      const card = makeStatCard(counts[cat.slug] || 0, cat.label);
      statsGrid.appendChild(card);
    });

    // Recent Projects
    const allProjects = await getProjects();
    const projects = allProjects.sort((a, b) => b.order - a.order).slice(0, 6);
    recentList.innerHTML = '';
    if (projects.length === 0) {
      recentList.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;">Nenhum projeto ainda.</p>';
      return;
    }
    projects.forEach(p => {
      const item = document.createElement('div');
      item.className = 'recent-item';
      const imgSrc = p.images && p.images[0];
      item.innerHTML = `
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${p.title}" class="recent-thumb" loading="lazy">`
          : `<div class="recent-thumb" style="display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--text-muted)">IMG</div>`
        }
        <div class="recent-item-info">
          <div class="recent-item-title">${p.title}</div>
          <div class="recent-item-cat">${getCategoryLabel(p.category)} · ${p.year || '—'}</div>
        </div>
        <span class="recent-item-status ${p.visible ? 'status-visible' : 'status-hidden'}">
          ${p.visible ? 'Visível' : 'Oculto'}
        </span>
      `;
      recentList.appendChild(item);
    });
  }

  function makeStatCard(num, label) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-card-num">${num}</div>
      <div class="stat-card-label">${label}</div>
    `;
    return card;
  }

  /* ══════════════════════════════════════════════════════
     PROJECTS TABLE
  ══════════════════════════════════════════════════════ */
  let tableFilterCat   = 'all';
  let tableSearchQuery = '';

  async function renderProjectsTable() {
    let projects = (await getProjects()).sort((a, b) => a.order - b.order);

    if (tableFilterCat !== 'all') {
      projects = projects.filter(p => p.category === tableFilterCat);
    }
    if (tableSearchQuery) {
      const q = tableSearchQuery.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.client || '').toLowerCase().includes(q)
      );
    }

    projectsTableBody.innerHTML = '';
    if (projects.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="8" style="text-align:center;color:var(--text-muted);padding:2rem;">Nenhum projeto encontrado.</td>`;
      projectsTableBody.appendChild(tr);
      return;
    }

    projects.forEach(p => {
      const tr = document.createElement('tr');
      const imgSrc = p.images && p.images[0];
      tr.innerHTML = `
        <td>
          <div class="order-btns">
            <button class="btn-icon" title="Mover para cima" onclick="handleMove('${p.id}','up')">↑</button>
            <button class="btn-icon" title="Mover para baixo" onclick="handleMove('${p.id}','down')">↓</button>
          </div>
        </td>
        <td>
          ${imgSrc
            ? `<img src="${imgSrc}" alt="${p.title}" class="table-thumb" loading="lazy">`
            : `<div class="table-thumb-placeholder">IMG</div>`
          }
        </td>
        <td><span class="table-title">${p.title}</span></td>
        <td>${getCategoryLabel(p.category)}</td>
        <td>${p.client || '—'}</td>
        <td>${p.year || '—'}</td>
        <td>
          <span class="recent-item-status ${p.visible ? 'status-visible' : 'status-hidden'}">
            ${p.visible ? 'Visível' : 'Oculto'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" title="${p.visible ? 'Ocultar' : 'Mostrar'}" onclick="handleToggle('${p.id}')">
              ${p.visible ? '👁' : '🚫'}
            </button>
            <button class="btn-icon" title="Editar" onclick="handleEdit('${p.id}')">✎</button>
            <button class="btn-icon danger" title="Eliminar" onclick="handleDeleteRequest('${p.id}')">✕</button>
          </div>
        </td>
      `;
      projectsTableBody.appendChild(tr);
    });
  }

  projectSearch.addEventListener('input', (e) => {
    tableSearchQuery = e.target.value;
    renderProjectsTable();
  });
  categoryFilter.addEventListener('change', (e) => {
    tableFilterCat = e.target.value;
    renderProjectsTable();
  });

  /* ══════════════════════════════════════════════════════
     PROJECT ACTIONS (global scope for inline onclick)
  ══════════════════════════════════════════════════════ */
  window.handleMove = async (id, dir) => {
    await moveProject(id, dir);
    await renderProjectsTable();
  };

  window.handleToggle = async (id) => {
    await toggleProjectVisibility(id);
    await renderProjectsTable();
    showToast('Visibilidade atualizada.');
  };

  window.handleEdit = async (id) => {
    const p = await getProjectById(id);
    if (!p) return;
    openEditForm(p);
  };

  window.handleDeleteRequest = (id) => {
    pendingDeleteId = id;
    confirmDialog.style.display = 'flex';
  };

  confirmCancel.addEventListener('click', () => {
    pendingDeleteId = null;
    confirmDialog.style.display = 'none';
  });

  confirmDelete.addEventListener('click', async () => {
    if (pendingDeleteId) {
      await deleteProject(pendingDeleteId);
      pendingDeleteId = null;
      confirmDialog.style.display = 'none';
      await renderProjectsTable();
      await renderDashboard();
      showToast('Projeto eliminado.');
    }
  });

  /* ══════════════════════════════════════════════════════
     FORM — ADD / EDIT
  ══════════════════════════════════════════════════════ */
  function resetForm() {
    projectForm.reset();
    editIdInput.value = '';
    formTitle.textContent = 'Novo Projeto';
    uploadedImages = [];
    // Reset URL list to one empty row
    imageUrlList.innerHTML = `
      <div class="image-url-row">
        <input type="url" class="image-url-input" placeholder="https://exemplo.com/imagem.jpg">
        <button type="button" class="btn-icon remove-url-btn">✕</button>
      </div>`;
    bindUrlRemoveBtn(imageUrlList.querySelector('.remove-url-btn'));
    updatePreviewGrid([]);
    projVisible.checked = true;
    projFeatured.checked = true;
    // Reset to URL tab
    switchImageTab('urls');
    uploadPreview.innerHTML = '';
    // Tags & blocks
    projTags.value = '';
    updateTagsPreview();
    blocksState = [];
    renderBlocksList();
  }

  function openEditForm(p) {
    showView('add');
    formTitle.textContent = 'Editar Projeto';
    pageTitle.textContent = 'Editar Projeto';
    editIdInput.value   = p.id;
    projTitle.value     = p.title || '';
    projCategory.value  = p.category || '';
    projClient.value    = p.client || '';
    projYear.value      = p.year || '';
    projDesc.value      = p.description || '';
    projVisible.checked = p.visible !== false;
    projFeatured.checked = p.featured !== false;

    // Populate URL inputs
    const images = p.images || [];
    imageUrlList.innerHTML = '';
    if (images.length === 0) {
      addUrlRow('');
    } else {
      images.forEach(url => addUrlRow(url));
    }
    updatePreviewGrid(images);
    uploadedImages = [];
    uploadPreview.innerHTML = '';

    // Tags & blocks
    projTags.value = (p.tags || []).join(', ');
    updateTagsPreview();
    blocksState = JSON.parse(JSON.stringify(p.blocks || []));
    renderBlocksList();
  }

  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (uploadsInFlight > 0) {
      showToast('Aguarda o fim do upload das imagens...', true);
      return;
    }

    saveDraftBtn.disabled = true;
    publishBtn.disabled = true;

    try {
      const images = collectImages();
      const data = {
        title:       projTitle.value.trim(),
        category:    projCategory.value,
        client:      projClient.value.trim(),
        year:        projYear.value.trim(),
        description: projDesc.value.trim(),
        visible:     projVisible.checked,
        featured:    projFeatured.checked,
        images,
        tags:        parseTagsInput(),
        blocks:      blocksState,
      };

      const id = editIdInput.value;
      if (id) {
        await updateProject(id, data);
        showToast('Projeto atualizado com sucesso!');
      } else {
        await addProject(data);
        showToast('Projeto adicionado com sucesso!');
      }

      await showView('projects');
    } catch (err) {
      console.error(err);
      showToast('Erro ao guardar projeto. Tenta novamente.', true);
    } finally {
      saveDraftBtn.disabled = false;
      publishBtn.disabled = false;
    }
  });

  function validateForm() {
    let valid = true;
    [projTitle, projCategory].forEach(el => {
      el.classList.remove('error');
      if (!el.value.trim()) {
        el.classList.add('error');
        valid = false;
      }
    });
    if (!valid) showToast('Preenche os campos obrigatórios (*)!', true);
    return valid;
  }

  function collectImages() {
    const urlInputs = imageUrlList.querySelectorAll('.image-url-input');
    const urls = Array.from(urlInputs)
      .map(i => i.value.trim())
      .filter(v => v.length > 0);
    return [...urls, ...uploadedImages];
  }

  cancelForm.addEventListener('click', () => showView('projects'));

  saveDraftBtn.addEventListener('click', () => {
    projVisible.checked = false;
    projectForm.requestSubmit();
  });

  publishBtn.addEventListener('click', () => {
    projVisible.checked = true;
    projectForm.requestSubmit();
  });

  // Os ícones do canvas vazio ("Comece a criar o seu projeto") disparam os mesmos
  // botões reais da sidebar, para não duplicar lógica.
  document.querySelectorAll('.editor-canvas-icon[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.add);
      if (target) target.click();
    });
  });

  /* ─── URL ROWS ──────────────────────────────────────────── */
  function addUrlRow(value = '') {
    const row = document.createElement('div');
    row.className = 'image-url-row';
    row.innerHTML = `
      <input type="url" class="image-url-input" placeholder="https://exemplo.com/imagem.jpg" value="${value}">
      <button type="button" class="btn-icon remove-url-btn">✕</button>
    `;
    imageUrlList.appendChild(row);
    const removeBtn = row.querySelector('.remove-url-btn');
    bindUrlRemoveBtn(removeBtn);

    const input = row.querySelector('.image-url-input');
    input.addEventListener('input', () => {
      const urls = Array.from(imageUrlList.querySelectorAll('.image-url-input'))
        .map(i => i.value.trim()).filter(Boolean);
      updatePreviewGrid([...urls, ...uploadedImages]);
    });
  }

  function bindUrlRemoveBtn(btn) {
    btn.addEventListener('click', () => {
      if (imageUrlList.querySelectorAll('.image-url-row').length > 1) {
        btn.closest('.image-url-row').remove();
      } else {
        btn.closest('.image-url-row').querySelector('.image-url-input').value = '';
      }
      const urls = Array.from(imageUrlList.querySelectorAll('.image-url-input'))
        .map(i => i.value.trim()).filter(Boolean);
      updatePreviewGrid([...urls, ...uploadedImages]);
    });
  }

  addUrlBtn.addEventListener('click', () => { addUrlRow(); });

  /* ─── IMAGE TABS ────────────────────────────────────────── */
  tabUrls.addEventListener('click',   () => switchImageTab('urls'));
  tabUpload.addEventListener('click', () => switchImageTab('upload'));

  function switchImageTab(tab) {
    if (tab === 'urls') {
      tabUrls.classList.add('active');
      tabUpload.classList.remove('active');
      panelUrls.style.display   = 'block';
      panelUpload.style.display = 'none';
    } else {
      tabUpload.classList.add('active');
      tabUrls.classList.remove('active');
      panelUpload.style.display = 'block';
      panelUrls.style.display   = 'none';
    }
  }

  /* ─── FILE UPLOAD (envia diretamente para o Supabase Storage) ─── */
  fileUpload.addEventListener('change', handleFileInput);
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files));
  });

  function handleFileInput(e) {
    handleFiles(Array.from(e.target.files));
  }

  function handleFiles(files) {
    files.filter(f => f.type.startsWith('image/')).forEach(async (file) => {
      uploadsInFlight++;
      const localPreviewUrl = URL.createObjectURL(file);
      const thumbWrap = addUploadThumb(localPreviewUrl, true);
      try {
        const publicUrl = await uploadProjectImage(file);
        uploadedImages.push(publicUrl);
        thumbWrap.classList.remove('uploading');
        const urls = Array.from(imageUrlList.querySelectorAll('.image-url-input'))
          .map(i => i.value.trim()).filter(Boolean);
        updatePreviewGrid([...urls, ...uploadedImages]);
      } catch (err) {
        showToast('Erro ao enviar imagem: ' + file.name, true);
        thumbWrap.remove();
      } finally {
        uploadsInFlight--;
      }
    });
  }

  function addUploadThumb(src, uploading = false) {
    const wrap = document.createElement('div');
    wrap.className = uploading ? 'uploading' : '';
    wrap.style.cssText = 'position:relative;width:60px;height:45px;border-radius:4px;overflow:hidden;';
    wrap.innerHTML = `
      <img src="${src}" style="width:100%;height:100%;object-fit:cover;">
      ${uploading ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:0.55rem;color:#fff;">...</div>` : ''}
      <button type="button" style="position:absolute;top:2px;right:2px;width:16px;height:16px;background:rgba(0,0,0,0.7);border:none;border-radius:50%;color:#fff;font-size:0.55rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    `;
    wrap.querySelector('button').addEventListener('click', () => {
      const idx = Array.from(uploadPreview.children).indexOf(wrap);
      uploadedImages.splice(idx, 1);
      wrap.remove();
      const urls = Array.from(imageUrlList.querySelectorAll('.image-url-input'))
        .map(i => i.value.trim()).filter(Boolean);
      updatePreviewGrid([...urls, ...uploadedImages]);
    });
    uploadPreview.appendChild(wrap);
    return wrap;
  }

  /* ─── PREVIEW GRID ──────────────────────────────────────── */
  function updatePreviewGrid(images) {
    imagePreviewGrid.innerHTML = '';
    if (!images || images.length === 0) {
      imagePreviewGrid.innerHTML = '<div class="preview-empty">Nenhuma imagem adicionada</div>';
      return;
    }
    images.forEach((src, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'preview-img-wrap';
      wrap.innerHTML = `
        <img src="${src}" alt="Preview ${i + 1}" loading="lazy">
        <button class="preview-remove" title="Remover imagem">✕</button>
      `;
      wrap.querySelector('.preview-remove').addEventListener('click', () => {
        // Determine if it's a URL or uploaded
        const urlInputs = Array.from(imageUrlList.querySelectorAll('.image-url-input'));
        const urlValues = urlInputs.map(inp => inp.value.trim()).filter(Boolean);
        if (i < urlValues.length) {
          // Remove from URL inputs
          const matchIndex = urlInputs.findIndex(inp => inp.value.trim() === urlValues[i]);
          if (matchIndex !== -1) {
            if (urlInputs.length > 1) {
              urlInputs[matchIndex].closest('.image-url-row').remove();
            } else {
              urlInputs[matchIndex].value = '';
            }
          }
        } else {
          // Remove from uploaded
          const uploadIdx = i - urlValues.length;
          uploadedImages.splice(uploadIdx, 1);
          if (uploadPreview.children[uploadIdx]) {
            uploadPreview.children[uploadIdx].remove();
          }
        }
        const newUrls = Array.from(imageUrlList.querySelectorAll('.image-url-input'))
          .map(inp => inp.value.trim()).filter(Boolean);
        updatePreviewGrid([...newUrls, ...uploadedImages]);
      });
      imagePreviewGrid.appendChild(wrap);
    });
  }

  /* ══════════════════════════════════════════════════════
     TAGS
  ══════════════════════════════════════════════════════ */
  function parseTagsInput() {
    return projTags.value.split(',').map(t => t.trim()).filter(Boolean);
  }

  function updateTagsPreview() {
    const tags = parseTagsInput();
    tagsPreview.innerHTML = tags.map(t => `<span class="project-tag" style="color:var(--text-dim);border:1px solid var(--border);border-radius:30px;padding:0.25rem 0.75rem;font-size:0.72rem;">${t}</span>`).join('');
  }

  projTags.addEventListener('input', updateTagsPreview);

  /* ══════════════════════════════════════════════════════
     BLOCOS DE CONTEÚDO (editor estilo Behance)
  ══════════════════════════════════════════════════════ */
  function newBlockId() {
    blockIdCounter++;
    return `block-${Date.now()}-${blockIdCounter}`;
  }

  addImageBlockBtn.addEventListener('click', () => {
    blocksState.push({ id: newBlockId(), type: 'image', url: '', caption: '' });
    renderBlocksList();
  });

  addTextBlockBtn.addEventListener('click', () => {
    blocksState.push({ id: newBlockId(), type: 'text', content: '' });
    renderBlocksList();
  });

  addCarouselBlockBtn.addEventListener('click', () => {
    blocksState.push({ id: newBlockId(), type: 'carousel', images: [] });
    renderBlocksList();
  });

  addGridBlockBtn.addEventListener('click', () => {
    blocksState.push({ id: newBlockId(), type: 'grid', columns: 2, images: [] });
    renderBlocksList();
  });

  function renderBlocksList() {
    blocksList.innerHTML = '';
    blocksEmpty.style.display = blocksState.length === 0 ? 'block' : 'none';

    blocksState.forEach((block, index) => {
      const item = document.createElement('div');
      item.className = 'block-item';
      item.draggable = true;
      item.dataset.index = index;

      const typeLabels = { image: 'Imagem', text: 'Texto', carousel: 'Carrossel', grid: 'Grade de Fotos' };

      const body = document.createElement('div');
      body.className = 'block-body';

      const header = document.createElement('div');
      header.className = 'block-type-label';
      header.innerHTML = `<span>${typeLabels[block.type]}</span>`;

      const spacingSelect = document.createElement('select');
      spacingSelect.style.cssText = 'width:auto;padding:0.3rem 0.5rem;background:#f5f5f7;border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:0.72rem;margin-left:auto;margin-right:0.5rem;';
      [
        ['small', 'Espaçamento pequeno'],
        ['medium', 'Espaçamento médio'],
        ['large', 'Espaçamento grande'],
      ].forEach(([val, label]) => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = label;
        if ((block.spacing || 'medium') === val) opt.selected = true;
        spacingSelect.appendChild(opt);
      });
      spacingSelect.addEventListener('change', () => { block.spacing = spacingSelect.value; });
      header.appendChild(spacingSelect);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'block-remove-btn';
      removeBtn.textContent = '✕ remover';
      removeBtn.addEventListener('click', () => {
        blocksState.splice(index, 1);
        renderBlocksList();
      });
      header.appendChild(removeBtn);
      body.appendChild(header);

      if (block.type === 'image') {
        body.appendChild(buildImageBlockEditor(block));
      } else if (block.type === 'text') {
        body.appendChild(buildTextBlockEditor(block));
      } else if (block.type === 'carousel') {
        body.appendChild(buildCarouselBlockEditor(block));
      } else if (block.type === 'grid') {
        body.appendChild(buildGridBlockEditor(block));
      }

      const handle = document.createElement('span');
      handle.className = 'block-drag-handle';
      handle.textContent = '⠿';

      item.appendChild(handle);
      item.appendChild(body);
      blocksList.appendChild(item);

      bindBlockDragEvents(item);
    });
  }

  function buildImageBlockEditor(block) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:0.5rem;';

    const dropZone = document.createElement('div');
    dropZone.className = 'block-image-dropzone';
    dropZone.style.cssText = 'border:1px dashed var(--border);border-radius:6px;padding:0.5rem;text-align:center;';

    const preview = document.createElement('img');
    preview.className = 'block-image-preview';
    preview.style.display = block.url ? 'block' : 'none';
    if (block.url) preview.src = block.url;

    const dropHint = document.createElement('span');
    dropHint.textContent = 'Arrasta uma imagem para aqui, ou usa o botão de upload abaixo';
    dropHint.style.cssText = 'font-size:0.72rem;color:var(--text-muted);display:block;';

    dropZone.appendChild(preview);
    dropZone.appendChild(dropHint);

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'URL da imagem, ou usa o botão de upload';
    urlInput.value = block.url || '';
    urlInput.addEventListener('input', () => {
      block.url = urlInput.value.trim();
      preview.src = block.url;
      preview.style.display = block.url ? 'block' : 'none';
    });

    async function handleNewImageFile(file) {
      try {
        const url = await uploadProjectImage(file);
        block.url = url;
        urlInput.value = url;
        preview.src = url;
        preview.style.display = 'block';
      } catch {
        showToast('Erro ao enviar imagem.', true);
      }
    }

    makeDropTarget(dropZone, (files) => handleNewImageFile(files[0]));

    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'btn-admin-ghost';
    uploadBtn.textContent = 'Upload de imagem';
    uploadBtn.style.marginTop = '0.35rem';
    uploadBtn.addEventListener('click', () => {
      triggerFileUpload((file) => handleNewImageFile(file));
    });

    const captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.placeholder = 'Legenda (opcional)';
    captionInput.value = block.caption || '';
    captionInput.style.marginTop = '0.5rem';
    captionInput.addEventListener('input', () => { block.caption = captionInput.value; });

    wrap.appendChild(dropZone);
    wrap.appendChild(urlInput);
    wrap.appendChild(uploadBtn);
    wrap.appendChild(captionInput);
    return wrap;
  }

  function buildTextBlockEditor(block) {
    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.placeholder = 'Escreve o texto deste bloco...';
    textarea.value = block.content || '';
    textarea.addEventListener('input', () => { block.content = textarea.value; });
    return textarea;
  }

  function buildCarouselBlockEditor(block) {
    const wrap = document.createElement('div');

    const itemsWrap = document.createElement('div');
    itemsWrap.className = 'block-carousel-items';

    function renderCarouselItems() {
      itemsWrap.innerHTML = '';
      block.images.forEach((url, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'block-carousel-item';
        thumb.draggable = true;
        thumb.dataset.index = i;
        thumb.title = 'Arrasta para reordenar';
        thumb.innerHTML = `<img src="${url}"><button type="button">✕</button>`;
        thumb.querySelector('button').addEventListener('click', () => {
          block.images.splice(i, 1);
          renderCarouselItems();
        });

        thumb.addEventListener('dragstart', () => thumb.classList.add('dragging'));
        thumb.addEventListener('dragend', () => {
          thumb.classList.remove('dragging');
          itemsWrap.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        });
        thumb.addEventListener('dragover', (e) => {
          e.preventDefault();
          thumb.classList.add('drag-over');
        });
        thumb.addEventListener('dragleave', () => thumb.classList.remove('drag-over'));
        thumb.addEventListener('drop', (e) => {
          e.preventDefault();
          thumb.classList.remove('drag-over');
          const fromIdx = parseInt(itemsWrap.querySelector('.dragging')?.dataset.index, 10);
          const toIdx = parseInt(thumb.dataset.index, 10);
          if (isNaN(fromIdx) || isNaN(toIdx) || fromIdx === toIdx) return;
          const [moved] = block.images.splice(fromIdx, 1);
          block.images.splice(toIdx, 0, moved);
          renderCarouselItems();
        });

        itemsWrap.appendChild(thumb);
      });
    }
    renderCarouselItems();

    makeDropTarget(itemsWrap, (files) => {
      files.forEach(async (file) => {
        try {
          const url = await uploadProjectImage(file);
          block.images.push(url);
          renderCarouselItems();
        } catch {
          showToast('Erro ao enviar imagem.', true);
        }
      });
    });

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'URL da imagem — Enter para adicionar ao carrossel';
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && urlInput.value.trim()) {
        e.preventDefault();
        block.images.push(urlInput.value.trim());
        urlInput.value = '';
        renderCarouselItems();
      }
    });

    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'btn-admin-ghost';
    uploadBtn.textContent = 'Upload de imagem(ns)';
    uploadBtn.style.marginTop = '0.35rem';
    uploadBtn.addEventListener('click', () => {
      triggerFileUpload(async (file) => {
        try {
          const url = await uploadProjectImage(file);
          block.images.push(url);
          renderCarouselItems();
        } catch {
          showToast('Erro ao enviar imagem.', true);
        }
      }, true);
    });

    const dropHint = document.createElement('span');
    dropHint.textContent = 'Arrasta ficheiros para a área acima para adicionar, ou arrasta as miniaturas entre si para reordenar.';
    dropHint.style.cssText = 'font-size:0.7rem;color:var(--text-muted);display:block;margin-top:0.35rem;';

    wrap.appendChild(itemsWrap);
    wrap.appendChild(dropHint);
    wrap.appendChild(urlInput);
    wrap.appendChild(uploadBtn);
    return wrap;
  }

  function buildGridBlockEditor(block) {
    const wrap = document.createElement('div');

    const colsRow = document.createElement('div');
    colsRow.style.cssText = 'margin-bottom:0.6rem;display:flex;align-items:center;gap:0.5rem;';
    const colsLabel = document.createElement('span');
    colsLabel.textContent = 'Colunas:';
    colsLabel.style.cssText = 'font-size:0.8rem;color:var(--text-dim,#6b7280);';
    const colsSelect = document.createElement('select');
    colsSelect.style.cssText = 'width:auto;padding:0.4rem 0.6rem;background:#f5f5f7;border:1px solid var(--border);border-radius:4px;color:var(--text,#16181d);font-size:0.85rem;';
    [2, 3, 4].forEach(n => {
      const opt = document.createElement('option');
      opt.value = n;
      opt.textContent = `${n} colunas`;
      if ((block.columns || 2) === n) opt.selected = true;
      colsSelect.appendChild(opt);
    });
    colsSelect.addEventListener('change', () => { block.columns = parseInt(colsSelect.value, 10); });
    colsRow.appendChild(colsLabel);
    colsRow.appendChild(colsSelect);

    const itemsWrap = document.createElement('div');
    itemsWrap.className = 'block-carousel-items';

    function renderGridItems() {
      itemsWrap.innerHTML = '';
      block.images.forEach((url, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'block-carousel-item';
        thumb.draggable = true;
        thumb.dataset.index = i;
        thumb.title = 'Arrasta para reordenar';
        thumb.innerHTML = `<img src="${url}"><button type="button">✕</button>`;
        thumb.querySelector('button').addEventListener('click', () => {
          block.images.splice(i, 1);
          renderGridItems();
        });

        thumb.addEventListener('dragstart', () => thumb.classList.add('dragging'));
        thumb.addEventListener('dragend', () => {
          thumb.classList.remove('dragging');
          itemsWrap.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        });
        thumb.addEventListener('dragover', (e) => {
          e.preventDefault();
          thumb.classList.add('drag-over');
        });
        thumb.addEventListener('dragleave', () => thumb.classList.remove('drag-over'));
        thumb.addEventListener('drop', (e) => {
          e.preventDefault();
          thumb.classList.remove('drag-over');
          const fromIdx = parseInt(itemsWrap.querySelector('.dragging')?.dataset.index, 10);
          const toIdx = parseInt(thumb.dataset.index, 10);
          if (isNaN(fromIdx) || isNaN(toIdx) || fromIdx === toIdx) return;
          const [moved] = block.images.splice(fromIdx, 1);
          block.images.splice(toIdx, 0, moved);
          renderGridItems();
        });

        itemsWrap.appendChild(thumb);
      });
    }
    renderGridItems();

    makeDropTarget(itemsWrap, (files) => {
      files.forEach(async (file) => {
        try {
          const url = await uploadProjectImage(file);
          block.images.push(url);
          renderGridItems();
        } catch {
          showToast('Erro ao enviar imagem.', true);
        }
      });
    });

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'URL da imagem — Enter para adicionar à grelha';
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && urlInput.value.trim()) {
        e.preventDefault();
        block.images.push(urlInput.value.trim());
        urlInput.value = '';
        renderGridItems();
      }
    });

    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'btn-admin-ghost';
    uploadBtn.textContent = 'Upload de imagem(ns)';
    uploadBtn.style.marginTop = '0.35rem';
    uploadBtn.addEventListener('click', () => {
      triggerFileUpload(async (file) => {
        try {
          const url = await uploadProjectImage(file);
          block.images.push(url);
          renderGridItems();
        } catch {
          showToast('Erro ao enviar imagem.', true);
        }
      }, true);
    });

    wrap.appendChild(colsRow);
    wrap.appendChild(itemsWrap);
    wrap.appendChild(urlInput);
    wrap.appendChild(uploadBtn);
    return wrap;
  }

  /**
   * Torna um elemento numa zona onde se pode largar ficheiros do computador
   * (drag-and-drop), além do clique normal. Chama onFiles(fileList) ao largar.
   */
  function makeDropTarget(el, onFiles) {
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => {
      el.classList.remove('drag-over');
    });
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length) onFiles(files);
    });
  }

  /**
   * Abre um seletor de ficheiros nativo e chama onFile(file) para cada ficheiro escolhido.
   */
  function triggerFileUpload(onFile, multiple = false) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = multiple;
    input.style.display = 'none';
    input.addEventListener('change', () => {
      Array.from(input.files).forEach(onFile);
      input.remove();
    });
    document.body.appendChild(input);
    input.click();
  }

  /* ─── DRAG & DROP DE BLOCOS ─────────────────────────── */
  function bindBlockDragEvents(item) {
    item.addEventListener('dragstart', () => {
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      document.querySelectorAll('.block-item.drag-over').forEach(el => el.classList.remove('drag-over'));
    });
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      item.classList.add('drag-over');
    });
    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      const fromIndex = parseInt(document.querySelector('.block-item.dragging')?.dataset.index, 10);
      const toIndex = parseInt(item.dataset.index, 10);
      if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex === toIndex) return;
      const [moved] = blocksState.splice(fromIndex, 1);
      blocksState.splice(toIndex, 0, moved);
      renderBlocksList();
    });
  }

  /* ══════════════════════════════════════════════════════
     DOCUMENTOS DE SERVIÇO
  ══════════════════════════════════════════════════════ */
  async function renderDocumentsGrid() {
    const docs = await getServiceDocuments();
    documentsGrid.innerHTML = '';

    docs.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.style.cursor = 'pointer';
      card.style.textAlign = 'left';
      const missing = !doc.delivery_time || !doc.revisions || !doc.payment_method;
      card.innerHTML = `
        <div class="stat-card-label" style="margin-bottom:0.5rem;">${doc.title}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);line-height:1.5;margin-bottom:1rem;">
          <div><strong>Prazo:</strong> ${doc.delivery_time || '— por preencher —'}</div>
          <div><strong>Alterações:</strong> ${doc.revisions || '— por preencher —'}</div>
          <div><strong>Pagamento:</strong> ${doc.payment_method || '— por preencher —'}</div>
        </div>
        ${missing ? '<span class="recent-item-status status-hidden" style="margin-bottom:0.75rem;display:inline-block;">Dados em falta</span><br>' : ''}
        <button type="button" class="btn-admin-ghost" style="width:100%;">Editar</button>
      `;
      card.querySelector('button').addEventListener('click', () => openDocumentEditForm(doc));
      documentsGrid.appendChild(card);
    });
  }

  function openDocumentEditForm(doc) {
    documentFormWrap.style.display = 'block';
    documentFormTitle.textContent = `Editar — ${doc.title}`;
    docServiceType.value  = doc.service_type;
    docTitle.value        = doc.title || '';
    docWelcome.value      = doc.welcome_message || '';
    docIncludes.value     = (doc.includes || []).join('\n');
    docDeliveryTime.value = doc.delivery_time || '';
    docRevisions.value    = doc.revisions || '';
    docPayment.value      = doc.payment_method || '';
    docNextSteps.value    = (doc.next_steps || []).join('\n');
    documentFormWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  cancelDocumentForm.addEventListener('click', () => {
    documentFormWrap.style.display = 'none';
  });

  documentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = documentForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      const data = {
        title: docTitle.value.trim(),
        welcome_message: docWelcome.value.trim(),
        includes: docIncludes.value.split('\n').map(s => s.trim()).filter(Boolean),
        delivery_time: docDeliveryTime.value.trim(),
        revisions: docRevisions.value.trim(),
        payment_method: docPayment.value.trim(),
        next_steps: docNextSteps.value.split('\n').map(s => s.trim()).filter(Boolean),
      };
      await updateServiceDocument(docServiceType.value, data);
      showToast('Documento de serviço atualizado!');
      documentFormWrap.style.display = 'none';
      await renderDocumentsGrid();
    } catch (err) {
      console.error(err);
      showToast('Erro ao guardar documento.', true);
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ══════════════════════════════════════════════════════
     BRIEFINGS
  ══════════════════════════════════════════════════════ */
  let briefingsCache = [];
  let briefingFilterStatus = 'all';

  const STATUS_LABELS = {
    novo: 'Novo',
    em_andamento: 'Em andamento',
    concluido: 'Concluído',
  };

  async function renderBriefingsTable() {
    briefingsCache = await getBriefings();
    let list = briefingsCache;
    if (briefingFilterStatus !== 'all') {
      list = list.filter(b => b.status === briefingFilterStatus);
    }

    briefingsTableBody.innerHTML = '';
    if (list.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem;">Nenhum briefing encontrado.</td>`;
      briefingsTableBody.appendChild(tr);
      return;
    }

    list.forEach(b => {
      const tr = document.createElement('tr');
      const date = new Date(b.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      tr.innerHTML = `
        <td>${date}</td>
        <td><span class="table-title">${escapeHtmlAdmin(b.client_name)}</span></td>
        <td>${escapeHtmlAdmin(b.client_contact)}</td>
        <td>${getCategoryLabel(b.service_type)}</td>
        <td>${b.pdf_sent ? '✅' : (b.contact_is_email ? '⏳' : '—')}</td>
        <td>
          <select class="select-input briefing-status-select" data-id="${b.id}" style="font-size:0.75rem;padding:0.3rem 0.5rem;">
            <option value="novo" ${b.status === 'novo' ? 'selected' : ''}>Novo</option>
            <option value="em_andamento" ${b.status === 'em_andamento' ? 'selected' : ''}>Em andamento</option>
            <option value="concluido" ${b.status === 'concluido' ? 'selected' : ''}>Concluído</option>
          </select>
        </td>
        <td>
          <button type="button" class="btn-icon" title="Ver detalhes" data-id="${b.id}">👁</button>
        </td>
      `;
      tr.querySelector('.briefing-status-select').addEventListener('change', async (e) => {
        try {
          await updateBriefingStatus(b.id, e.target.value);
          showToast('Estado atualizado.');
        } catch {
          showToast('Erro ao atualizar estado.', true);
        }
      });
      tr.querySelector('button[title="Ver detalhes"]').addEventListener('click', () => openBriefingDetails(b));
      briefingsTableBody.appendChild(tr);
    });
  }

  briefingStatusFilter.addEventListener('change', (e) => {
    briefingFilterStatus = e.target.value;
    renderBriefingsTable();
  });

  function openBriefingDetails(b) {
    briefingDetailsTitle.textContent = `${b.client_name} — ${getCategoryLabel(b.service_type)}`;
    const entries = Object.entries(b.form_data || {});
    briefingDetailsBody.innerHTML = entries.map(([label, value]) => `
      <div style="margin-bottom:0.85rem;">
        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:0.2rem;">${escapeHtmlAdmin(label)}</div>
        <div>${escapeHtmlAdmin(value)}</div>
      </div>
    `).join('') || '<p style="color:var(--text-muted);">Sem respostas registadas.</p>';
    briefingDetailsDialog.style.display = 'flex';
  }

  briefingDetailsClose.addEventListener('click', () => {
    briefingDetailsDialog.style.display = 'none';
  });

  function escapeHtmlAdmin(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ══════════════════════════════════════════════════════
     COMPRIMIR IMAGENS EXISTENTES (correr uma vez, em lotes)
  ══════════════════════════════════════════════════════ */
  compressImagesBtn.addEventListener('click', async () => {
    if (!confirm('Isto vai percorrer todas as imagens já enviadas e comprimi-las, mantendo os mesmos links (nada quebra). Pode demorar alguns minutos consoante a quantidade de imagens — não feches esta página enquanto estiver a correr. Continuar?')) {
      return;
    }
    compressImagesBtn.disabled = true;

    const totals = { processed: 0, skipped: 0, failed: 0, bytesBefore: 0, bytesAfter: 0 };
    let offset = 0;
    let done = false;

    try {
      while (!done) {
        const { data, error } = await supabaseClient.functions.invoke('compress-existing-images', {
          body: { offset }
        });
        if (error) throw error;

        totals.processed += data.processed;
        totals.skipped += data.skipped;
        totals.failed += data.failed;
        totals.bytesBefore += data.bytesBefore;
        totals.bytesAfter += data.bytesAfter;
        console.log('Detalhes do lote:', data.details);

        offset = data.nextOffset;
        done = data.done;

        compressImagesBtn.textContent = `A comprimir... ${Math.min(offset, data.total)}/${data.total}`;
      }

      const savedMB = ((totals.bytesBefore - totals.bytesAfter) / (1024 * 1024)).toFixed(1);
      showToast(`Concluído! ${totals.processed} imagens comprimidas, ${savedMB}MB poupados. (${totals.skipped} já otimizadas, ${totals.failed} falhas)`);
    } catch (err) {
      console.error(err);
      showToast('Erro ao comprimir imagens. Vê a consola para detalhes.', true);
    } finally {
      compressImagesBtn.disabled = false;
      compressImagesBtn.textContent = '🗜 Comprimir Imagens';
    }
  });

  /* ══════════════════════════════════════════════════════
     EXPORT / IMPORT
  ══════════════════════════════════════════════════════ */
  exportBtn.addEventListener('click', async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `lucas-muindi-portfolio-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dados exportados!');
  });

  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        await importData(ev.target.result);
        showToast('Dados importados com sucesso!');
        await renderDashboard();
        if (views.projects.style.display !== 'none') await renderProjectsTable();
      } catch {
        showToast('Erro ao importar ficheiro JSON.', true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  /* ══════════════════════════════════════════════════════
     TOAST
  ══════════════════════════════════════════════════════ */
  let toastTimer;
  function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /* ══════════════════════════════════════════════════════
     KEYBOARD SHORTCUTS
  ══════════════════════════════════════════════════════ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (confirmDialog.style.display !== 'none') {
        confirmDialog.style.display = 'none';
        pendingDeleteId = null;
      }
    }
  });

})();