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
    questions: document.getElementById('viewQuestions'),
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
  const docField = (id) => document.getElementById(id);
  const docWelcomeFields = [
    'docCoverEyebrow', 'docCoverSlogan',
    'docPage2TitleLine1', 'docPage2TitleEmphasis', 'docPage2NoteText',
    'docPage3TitleLine1', 'docPage3TitleEmphasis', 'docPage3Intro',
    'docStep1Title', 'docStep1Text', 'docStep2Title', 'docStep2Text', 'docStep3Title', 'docStep3Text', 'docStep4Title', 'docStep4Text',
    'docPage4TitleLine1', 'docPage4TitleEmphasis', 'docPage4Intro',
    'docPrinciple1Title', 'docPrinciple1Text', 'docPrinciple2Title', 'docPrinciple2Text', 'docPrinciple3Title', 'docPrinciple3Text', 'docTimeline',
    'docPage5TitleLine1', 'docPage5TitleEmphasis', 'docPage5Intro',
    'docNeed1Title', 'docNeed1Text', 'docNeed2Title', 'docNeed2Text', 'docNeed3Title', 'docNeed3Text', 'docNeed4Title', 'docNeed4Text',
    'docCalloutLabel', 'docCalloutTitle', 'docCalloutText',
    'docPage6TitleLine1', 'docPage6TitleEmphasis', 'docPage6Intro',
    'docSchedule1Title', 'docSchedule1Text', 'docSchedule2Title', 'docSchedule2Text', 'docSchedule3Title', 'docSchedule3Text', 'docSchedule4Title', 'docSchedule4Text',
    'docContactEmail', 'docContactUrl',
    'docPage7TitleLine1', 'docPage7TitleEmphasis', 'docPage7CloseText', 'docFooterEmail', 'docFooterUrl'
  ];

  // Briefings
  const briefingStatusFilter = document.getElementById('briefingStatusFilter');
  const briefingsTableBody   = document.getElementById('briefingsTableBody');
  const briefingDetailsDialog = document.getElementById('briefingDetailsDialog');
  const briefingDetailsTitle  = document.getElementById('briefingDetailsTitle');
  const briefingDetailsBody   = document.getElementById('briefingDetailsBody');
  const briefingDetailsClose  = document.getElementById('briefingDetailsClose');
  const briefingAttachmentList = document.getElementById('briefingAttachmentList');

  // Perguntas editáveis do briefing
  const questionServiceFilter = document.getElementById('questionServiceFilter');
  let questionServicePicker = document.getElementById('questionServicePicker');
  const questionsTableBody = document.getElementById('questionsTableBody');
  const addQuestionBtn = document.getElementById('addQuestionBtn');
  const questionEditorWrap = document.getElementById('questionEditorWrap');
  const questionEditorTitle = document.getElementById('questionEditorTitle');
  const questionForm = document.getElementById('questionForm');
  const questionId = document.getElementById('questionId');
  const questionKey = document.getElementById('questionKey');
  const questionSectionKey = document.getElementById('questionSectionKey');
  const questionSectionTitle = document.getElementById('questionSectionTitle');
  const questionLabel = document.getElementById('questionLabel');
  const questionHelp = document.getElementById('questionHelp');
  const questionPlaceholder = document.getElementById('questionPlaceholder');
  const questionInputType = document.getElementById('questionInputType');
  const questionSortOrder = document.getElementById('questionSortOrder');
  const questionMode = document.getElementById('questionMode');
  const questionRequired = document.getElementById('questionRequired');
  const questionRole = document.getElementById('questionRole');
  const cancelQuestionForm = document.getElementById('cancelQuestionForm');
  const cancelQuestionFormBottom = document.getElementById('cancelQuestionFormBottom');
  const questionCount = document.getElementById('questionCount');
  const questionSearch = document.getElementById('questionSearch');
  const questionPreviewBody = document.getElementById('questionPreviewBody');
  const questionOptionsWrap = document.getElementById('questionOptionsWrap');
  const questionOptions = document.getElementById('questionOptions');

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
  const ADMIN_STATE_KEY = 'lucas-muindi-admin-state-v2';

  function readAdminState() {
    try {
      const raw = window.localStorage.getItem(ADMIN_STATE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      console.warn('Não foi possível ler o estado guardado do painel:', error);
      return {};
    }
  }

  function writeAdminState(patch = {}) {
    try {
      window.localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify({ ...readAdminState(), ...patch }));
    } catch (error) {
      console.warn('Não foi possível guardar o estado do painel:', error);
    }
  }

  function getInitialAdminView() {
    const savedView = readAdminState().view;
    return savedView && Object.prototype.hasOwnProperty.call(views, savedView) ? savedView : 'dashboard';
  }

  function authorize() {
    loginScreen.style.display = 'none';
    adminPanel.style.display  = 'flex';
    if (!isPanelOpen) {
      // Recupera a última vista depois de um refresh, em vez de forçar o Dashboard.
      isPanelOpen = true;
      showView(getInitialAdminView());
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
    questions: 'Perguntas do Briefing',
  };

  async function showView(viewName) {
    if (!Object.prototype.hasOwnProperty.call(views, viewName)) viewName = 'dashboard';
    writeAdminState({ view: viewName });
    Object.entries(views).forEach(([name, el]) => {
      if (el) el.style.display = name === viewName ? 'block' : 'none';
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
    if (viewName === 'questions') {
      questionEditorWrap.style.display = 'none';
      const savedState = readAdminState();
      if (questionServiceFilter && QUESTION_SERVICE_LABELS[savedState.questionService]) {
        questionServiceFilter.value = savedState.questionService;
      }
      await renderQuestionsTable();
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
  const WELCOME_SERVICE_LABELS = {
    branding: 'Branding',
    'identidade-visual': 'Identidade Visual',
    'social-media': 'Social Media',
    'design-publicitario': 'Design Publicitário & Campanhas',
    'design-eventos': 'Identidade Visual para Eventos',
    'web-design': 'Web Design',
    'materiais-graficos': 'Materiais Gráficos & Impressos',
  };

  const getWelcomeContent = (doc, serviceType) => window.WelcomePack
    ? window.WelcomePack.fromDocument(doc, serviceType)
    : (doc || { service_type: serviceType });

  function setDocumentField(id, value) {
    const field = docField(id);
    if (field) field.value = value == null ? '' : String(value);
  }

  function getDocumentField(id) {
    const field = docField(id);
    return field ? field.value.trim() : '';
  }

  function setDocumentList(prefix, items, length) {
    const list = Array.isArray(items) ? items : [];
    for (let index = 0; index < length; index += 1) {
      const item = list[index] || {};
      setDocumentField(`${prefix}${index + 1}Title`, item.title || '');
      setDocumentField(`${prefix}${index + 1}Text`, item.text || '');
    }
  }

  function collectDocumentList(prefix, length, extra = {}) {
    return Array.from({ length }, (_, index) => ({
      ...extra,
      ...(extra.indexKey ? { [extra.indexKey]: String(index + 1).padStart(2, '0') } : {}),
      title: getDocumentField(`${prefix}${index + 1}Title`),
      text: getDocumentField(`${prefix}${index + 1}Text`),
    }));
  }

  async function renderDocumentsGrid() {
    const docs = await getServiceDocuments();
    const docsByService = new Map((docs || []).map(doc => [doc.service_type, doc]));
    const serviceTypes = window.WelcomePack?.serviceTypes || Object.keys(WELCOME_SERVICE_LABELS);
    documentsGrid.innerHTML = '';

    serviceTypes.forEach(serviceType => {
      const existing = docsByService.get(serviceType) || { service_type: serviceType };
      const content = getWelcomeContent(existing, serviceType);
      const missing = !docsByService.has(serviceType);
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.style.cursor = 'pointer';
      card.style.textAlign = 'left';
      card.innerHTML = `
        <div class="stat-card-label" style="margin-bottom:0.5rem;">${escapeHtmlAdmin(content.title || WELCOME_SERVICE_LABELS[serviceType])}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);line-height:1.5;margin-bottom:1rem;">
          <div><strong>Prazo:</strong> ${escapeHtmlAdmin(content.deliveryTime || '— por preencher —')}</div>
          <div><strong>Páginas:</strong> 7 páginas editoriais</div>
          <div><strong>Estado:</strong> ${missing ? 'Ainda não guardado' : 'Personalizado'}</div>
        </div>
        ${missing ? '<span class="recent-item-status status-hidden" style="margin-bottom:0.75rem;display:inline-block;">Usar conteúdo padrão</span><br>' : '<span class="recent-item-status status-visible" style="margin-bottom:0.75rem;display:inline-block;">Pronto para envio</span><br>'}
        <button type="button" class="btn-admin-ghost" style="width:100%;">Editar Welcome Pack</button>
      `;
      card.querySelector('button').addEventListener('click', () => openDocumentEditForm(existing));
      documentsGrid.appendChild(card);
    });
  }

  function openDocumentEditForm(doc) {
    const serviceType = doc?.service_type || 'identidade-visual';
    const content = getWelcomeContent(doc, serviceType);
    documentFormWrap.style.display = 'block';
    documentFormTitle.textContent = `Editar Welcome Pack — ${content.title || WELCOME_SERVICE_LABELS[serviceType]}`;
    docServiceType.value = serviceType;
    setDocumentField('docTitle', content.title);
    setDocumentField('docCoverEyebrow', content.page1?.eyebrow);
    setDocumentField('docCoverSlogan', content.page1?.slogan);
    setDocumentField('docPage2TitleLine1', content.page2?.titleLine1);
    setDocumentField('docPage2TitleEmphasis', content.page2?.titleEmphasis);
    setDocumentField('docWelcome', content.welcomeMessage || content.page2?.intro);
    setDocumentField('docPage2NoteText', content.page2?.noteText);
    setDocumentField('docPage3TitleLine1', content.page3?.titleLine1);
    setDocumentField('docPage3TitleEmphasis', content.page3?.titleEmphasis);
    setDocumentField('docPage3Intro', content.page3?.intro);
    setDocumentList('docStep', content.page3?.steps, 4);
    setDocumentField('docPage4TitleLine1', content.page4?.titleLine1);
    setDocumentField('docPage4TitleEmphasis', content.page4?.titleEmphasis);
    setDocumentField('docPage4Intro', content.page4?.intro);
    setDocumentList('docPrinciple', content.page4?.principles, 3);
    setDocumentField('docTimeline', (content.page4?.timeline || []).join('\n'));
    setDocumentField('docPage5TitleLine1', content.page5?.titleLine1);
    setDocumentField('docPage5TitleEmphasis', content.page5?.titleEmphasis);
    setDocumentField('docPage5Intro', content.page5?.intro);
    setDocumentList('docNeed', content.page5?.needs, 4);
    setDocumentField('docCalloutLabel', content.page5?.calloutLabel);
    setDocumentField('docCalloutTitle', content.page5?.calloutTitle);
    setDocumentField('docCalloutText', content.page5?.calloutText);
    setDocumentField('docPage6TitleLine1', content.page6?.titleLine1);
    setDocumentField('docPage6TitleEmphasis', content.page6?.titleEmphasis);
    setDocumentField('docPage6Intro', content.page6?.intro);
    setDocumentList('docSchedule', content.page6?.schedule, 4);
    setDocumentField('docDeliveryTime', content.deliveryTime);
    setDocumentField('docRevisions', content.revisions);
    setDocumentField('docPayment', content.paymentMethod);
    setDocumentField('docContactEmail', content.page6?.contactEmail || content.shared?.contactEmail);
    setDocumentField('docContactUrl', content.page6?.contactUrl || content.shared?.portfolioUrl);
    setDocumentField('docPage7TitleLine1', content.page7?.closeHeadlineLine1);
    setDocumentField('docPage7TitleEmphasis', content.page7?.closeHeadlineEmphasis);
    setDocumentField('docPage7CloseText', content.page7?.closeText);
    setDocumentField('docFooterEmail', content.page7?.footerEmail || content.shared?.contactEmail);
    setDocumentField('docFooterUrl', content.page7?.footerUrl || content.shared?.portfolioUrl);
    setDocumentField('docIncludes', (content.includes || []).join('\n'));
    setDocumentField('docNextSteps', (content.page3?.steps || []).map(step => step.title).join('\n'));
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
      const serviceType = docServiceType.value;
      const current = getWelcomeContent(null, serviceType);
      const page3Steps = collectDocumentList('docStep', 4);
      const page4Principles = collectDocumentList('docPrinciple', 3);
      const page5Needs = collectDocumentList('docNeed', 4, { indexKey: 'index' });
      const page6Schedule = collectDocumentList('docSchedule', 4).map((item, index) => ({
        label: current.page6?.schedule?.[index]?.label || `${String(index + 1).padStart(2, '0')} / ETAPA`,
        title: item.title,
        text: item.text,
        dark: index === 0,
      }));
      const content = window.WelcomePack
        ? window.WelcomePack.merge(current, {
          serviceType,
          title: getDocumentField('docTitle'),
          welcomeMessage: getDocumentField('docWelcome'),
          includes: getDocumentField('docIncludes').split('\n').map(value => value.trim()).filter(Boolean),
          deliveryTime: getDocumentField('docDeliveryTime'),
          revisions: getDocumentField('docRevisions'),
          paymentMethod: getDocumentField('docPayment'),
          page1: { eyebrow: getDocumentField('docCoverEyebrow'), slogan: getDocumentField('docCoverSlogan') },
          page2: {
            titleLine1: getDocumentField('docPage2TitleLine1'),
            titleEmphasis: getDocumentField('docPage2TitleEmphasis'),
            intro: getDocumentField('docWelcome'),
            noteText: getDocumentField('docPage2NoteText')
          },
          page3: {
            titleLine1: getDocumentField('docPage3TitleLine1'),
            titleEmphasis: getDocumentField('docPage3TitleEmphasis'),
            intro: getDocumentField('docPage3Intro'),
            steps: page3Steps
          },
          page4: {
            titleLine1: getDocumentField('docPage4TitleLine1'),
            titleEmphasis: getDocumentField('docPage4TitleEmphasis'),
            intro: getDocumentField('docPage4Intro'),
            principles: page4Principles,
            timeline: getDocumentField('docTimeline').split('\n').map(value => value.trim()).filter(Boolean)
          },
          page5: {
            titleLine1: getDocumentField('docPage5TitleLine1'),
            titleEmphasis: getDocumentField('docPage5TitleEmphasis'),
            intro: getDocumentField('docPage5Intro'),
            needs: page5Needs,
            calloutLabel: getDocumentField('docCalloutLabel'),
            calloutTitle: getDocumentField('docCalloutTitle'),
            calloutText: getDocumentField('docCalloutText')
          },
          page6: {
            titleLine1: getDocumentField('docPage6TitleLine1'),
            titleEmphasis: getDocumentField('docPage6TitleEmphasis'),
            intro: getDocumentField('docPage6Intro'),
            schedule: page6Schedule,
            contactEmail: getDocumentField('docContactEmail'),
            contactUrl: getDocumentField('docContactUrl')
          },
          page7: {
            closeHeadlineLine1: getDocumentField('docPage7TitleLine1'),
            closeHeadlineEmphasis: getDocumentField('docPage7TitleEmphasis'),
            closeText: getDocumentField('docPage7CloseText'),
            footerEmail: getDocumentField('docFooterEmail'),
            footerUrl: getDocumentField('docFooterUrl')
          },
          shared: {
            contactEmail: getDocumentField('docContactEmail'),
            portfolioUrl: getDocumentField('docContactUrl')
          }
        })
        : current;
      const data = {
        title: getDocumentField('docTitle'),
        welcome_message: getDocumentField('docWelcome'),
        includes: getDocumentField('docIncludes').split('\n').map(value => value.trim()).filter(Boolean),
        delivery_time: getDocumentField('docDeliveryTime'),
        revisions: getDocumentField('docRevisions'),
        payment_method: getDocumentField('docPayment'),
        next_steps: page3Steps.map(step => step.title).filter(Boolean),
        content,
      };
      await updateServiceDocument(serviceType, data);
      showToast('Welcome Pack guardado para este serviço.');
      documentFormWrap.style.display = 'none';
      await renderDocumentsGrid();
    } catch (err) {
      console.error(err);
      showToast('Erro ao guardar Welcome Pack: ' + (err.message || 'tenta novamente.'), true);
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

  /* ══════════════════════════════════════════════════════
     PERGUNTAS EDITÁVEIS DO BRIEFING — WORKSPACE VISUAL
  ══════════════════════════════════════════════════════ */
  let questionsCache = [];
  let questionsRequestToken = 0;

  const QUESTION_SERVICE_LABELS = {
    branding: 'Branding',
    'identidade-visual': 'Identidade Visual',
    'social-media': 'Social Media',
    'design-publicitario': 'Flyer',
    'design-eventos': 'Identidade Visual para Evento',
    'web-design': 'Web Design',
    'materiais-graficos': 'Materiais Gráficos',
  };
  const QUESTION_TYPE_LABELS = {
    textarea: 'Texto longo', text: 'Texto curto', email: 'Email', file: 'Enviar ficheiro',
    choice_single: 'Escolher uma opção', choice_multiple: 'Escolher várias opções',
  };

  function ensureQuestionServiceOptions() {
    if (!questionServiceFilter) return;
    const selected = questionServiceFilter.value || 'identidade-visual';
    questionServiceFilter.innerHTML = Object.entries(QUESTION_SERVICE_LABELS)
      .map(([value, label]) => `<option value="${value}">${escapeHtmlAdmin(label)}</option>`)
      .join('');
    questionServiceFilter.value = QUESTION_SERVICE_LABELS[selected] ? selected : 'identidade-visual';

    if (!questionServicePicker) {
      questionServicePicker = document.createElement('div');
      questionServicePicker.id = 'questionServicePicker';
      questionServicePicker.className = 'questions-service-picker';
      questionServicePicker.setAttribute('role', 'tablist');
      questionServicePicker.setAttribute('aria-label', 'Escolher serviço');
      questionServiceFilter.closest('.questions-service-bar')?.insertAdjacentElement('afterend', questionServicePicker);
    }
  }

  function setQuestionValue(field, value) {
    if (field) field.value = value ?? '';
  }

  function makeQuestionKey(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 80);
  }

  function setQuestionChecked(field, value) {
    if (field) field.checked = Boolean(value);
  }

  function selectedQuestionOptions(question) {
    return Array.isArray(question?.options) ? question.options.map(option => {
      if (typeof option === 'string') return option;
      return option?.label || option?.value || '';
    }).filter(Boolean) : [];
  }

  function visibleQuestions() {
    const term = (questionSearch?.value || '').trim().toLowerCase();
    if (!term) return questionsCache;
    return questionsCache.filter(q => [q.label, q.section_title, q.help_text, q.question_key]
      .some(value => String(value || '').toLowerCase().includes(term)));
  }

  function renderQuestionServicePicker() {
    if (!questionServicePicker) return;
    const current = questionServiceFilter?.value || 'identidade-visual';
    questionServicePicker.innerHTML = Object.entries(QUESTION_SERVICE_LABELS).map(([value, label]) => `
      <button type="button" class="questions-service-pill ${value === current ? 'active' : ''}" data-service="${value}" role="tab" aria-selected="${value === current}">
        <span>${escapeHtmlAdmin(label)}</span>
        <small>${value === current ? `${questionsCache.length} perguntas` : 'abrir'}</small>
      </button>`).join('');
    questionServicePicker.querySelectorAll('[data-service]').forEach(button => {
      button.addEventListener('click', () => selectQuestionService(button.dataset.service));
    });
  }

  async function selectQuestionService(serviceType) {
    if (!QUESTION_SERVICE_LABELS[serviceType]) return;
    if (questionServiceFilter) questionServiceFilter.value = serviceType;
    writeAdminState({ questionService: serviceType, view: 'questions' });
    closeQuestionForm();
    await renderQuestionsTable();
  }

  async function renderQuestionsTable() {
    ensureQuestionServiceOptions();
    const serviceType = questionServiceFilter?.value || 'identidade-visual';
    const requestToken = ++questionsRequestToken;
    writeAdminState({ view: 'questions', questionService: serviceType });
    if (questionsTableBody) questionsTableBody.innerHTML = '<div class="questions-empty">A carregar perguntas…</div>';
    if (questionCount) questionCount.textContent = 'A carregar…';

    try {
      const loadedQuestions = await getBriefingQuestions(serviceType, true);
      if (requestToken !== questionsRequestToken) return;
      questionsCache = Array.isArray(loadedQuestions) ? loadedQuestions : [];
    } catch (error) {
      if (requestToken !== questionsRequestToken) return;
      questionsCache = [];
      if (questionCount) questionCount.textContent = 'Erro ao carregar';
      if (questionsTableBody) {
        questionsTableBody.innerHTML = `<div class="questions-empty questions-error">Não foi possível carregar as perguntas deste serviço.<br><small>${escapeHtmlAdmin(error?.message || 'Verifica a ligação ao Supabase e tenta novamente.')}</small><br><button type="button" class="question-action" id="retryQuestionsBtn">Tentar novamente</button></div>`;
        document.getElementById('retryQuestionsBtn')?.addEventListener('click', () => renderQuestionsTable());
      }
      showToast(`Erro ao carregar perguntas: ${error?.message || 'tenta novamente.'}`, true);
      return;
    }

    const list = visibleQuestions().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    if (!questionsTableBody) return;
    questionsTableBody.innerHTML = '';
    renderQuestionServicePicker();
    const activeCount = questionsCache.filter(question => question.is_active).length;
    const inactiveCount = questionsCache.length - activeCount;
    if (questionCount) questionCount.textContent = `${activeCount} ativas${inactiveCount ? ` · ${inactiveCount} inativas` : ''}`;

    if (!list.length) {
      questionsTableBody.innerHTML = `<div class="questions-empty">${questionsCache.length ? 'Nenhuma pergunta corresponde à pesquisa.' : 'Ainda não existem perguntas neste serviço. Clica em “Nova pergunta” para começar.'}</div>`;
      return;
    }

    const grouped = new Map();
    list.forEach(question => {
      const key = question.section_key || 'geral';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(question);
    });

    grouped.forEach((sectionQuestions, sectionKey) => {
      const section = document.createElement('section');
      section.className = 'questions-section-card';
      const title = sectionQuestions[0].section_title || sectionKey;
      section.innerHTML = `<div class="questions-section-head"><div><h3 class="questions-section-title">${escapeHtmlAdmin(title)}</h3><span class="questions-section-count">${sectionQuestions.length} pergunta${sectionQuestions.length === 1 ? '' : 's'}</span></div><button type="button" class="section-toggle" aria-expanded="true">Recolher</button></div><div class="questions-section-list"></div>`;
      const sectionList = section.querySelector('.questions-section-list');
      const sectionToggle = section.querySelector('.section-toggle');
      sectionToggle.addEventListener('click', () => {
        const collapsed = sectionList.hidden;
        sectionList.hidden = !collapsed;
        sectionToggle.textContent = collapsed ? 'Recolher' : 'Mostrar';
        sectionToggle.setAttribute('aria-expanded', String(collapsed));
      });
      sectionQuestions.forEach(question => {
        const card = document.createElement('article');
        card.className = 'question-card';
        const chips = [
          QUESTION_TYPE_LABELS[question.input_type] || question.input_type,
          question.mode === 'basic' ? 'Essencial' : question.mode === 'complete' ? 'Completo' : 'Sempre',
          question.required ? 'Obrigatória' : 'Opcional',
          !question.is_active ? 'Inativa' : '',
        ].filter(Boolean);
        card.innerHTML = `
          <span class="question-drag" title="A ordem é definida pela posição">⠿</span>
          <div class="question-card-copy">
            <div class="question-card-label">${escapeHtmlAdmin(question.label)}</div>
            <div class="question-card-meta">${chips.map(chip => `<span class="question-chip ${chip === 'Inativa' ? 'inactive' : ''}">${escapeHtmlAdmin(chip)}</span>`).join('')}</div>
          </div>
          <div class="question-card-actions">
            <button type="button" class="question-action" data-action="up" title="Mover para cima">↑</button>
            <button type="button" class="question-action" data-action="down" title="Mover para baixo">↓</button>
            <button type="button" class="question-action" data-action="duplicate">Duplicar</button>
            <button type="button" class="question-action" data-action="toggle">${question.is_active ? 'Desativar' : 'Ativar'}</button>
            <button type="button" class="question-action" data-action="edit">Editar</button>
            <button type="button" class="question-action danger" data-action="delete">Eliminar</button>
          </div>`;
        card.addEventListener('click', event => {
          if (!event.target.closest('button')) {
            renderQuestionPreview(question);
            openQuestionForm(question);
          }
        });
        card.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => handleQuestionAction(button.dataset.action, question)));
        sectionList.appendChild(card);
      });
      questionsTableBody.appendChild(section);
    });
  }

  async function handleQuestionAction(action, question) {
    try {
      if (action === 'edit') {
        openQuestionForm(question);
        return;
      }
      if (action === 'toggle') {
        await updateBriefingQuestion(question.id, { is_active: !question.is_active });
        await renderQuestionsTable();
        showToast(question.is_active ? 'Pergunta desativada.' : 'Pergunta ativada.');
        return;
      }
      if (action === 'delete') {
        if (!confirm('Eliminar esta pergunta? Os briefings antigos não serão alterados.')) return;
        await deleteBriefingQuestion(question.id);
        await renderQuestionsTable();
        showToast('Pergunta eliminada.');
        return;
      }
      if (action === 'duplicate') {
        await createBriefingQuestion({
          service_type: question.service_type,
          section_key: question.section_key,
          section_title: question.section_title,
          question_key: `${question.question_key}_copia_${Date.now()}`,
          label: `${question.label} (cópia)`,
          help_text: question.help_text,
          placeholder: question.placeholder,
          input_type: question.input_type,
          options: question.options || [],
          required: question.required,
          mode: question.mode,
          role: 'none',
          sort_order: (question.sort_order || 0) + 1,
          is_active: true,
        });
        await renderQuestionsTable();
        showToast('Pergunta duplicada.');
        return;
      }
      if (action === 'up' || action === 'down') {
        const ordered = [...questionsCache].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        const index = ordered.findIndex(item => item.id === question.id);
        const targetIndex = action === 'up' ? index - 1 : index + 1;
        if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;
        const target = ordered[targetIndex];
        await Promise.all([
          updateBriefingQuestion(question.id, { sort_order: target.sort_order || targetIndex + 1 }),
          updateBriefingQuestion(target.id, { sort_order: question.sort_order || index + 1 }),
        ]);
        await renderQuestionsTable();
        showToast('Ordem atualizada.');
      }
    } catch (error) {
      console.error(error);
      showToast(`Não foi possível concluir a ação: ${error.message || 'tenta novamente.'}`, true);
    }
  }

  function draftQuestionFromForm() {
    const options = (questionOptions?.value || '').split('\n').map(value => value.trim()).filter(Boolean);
    return {
      label: questionLabel?.value.trim() || 'A tua pergunta aparece aqui',
      help_text: questionHelp?.value.trim() || '',
      placeholder: questionPlaceholder?.value.trim() || 'Escreve a tua resposta',
      input_type: questionInputType?.value || 'textarea',
      options,
      required: Boolean(questionRequired?.checked),
    };
  }

  function renderQuestionPreview(question) {
    if (!questionPreviewBody) return;
    // `null` é usado ao fechar o editor: limpa a pré-visualização sem tentar
    // ler propriedades de uma pergunta inexistente. Sem argumento, mostra o rascunho.
    if (question === null) {
      questionPreviewBody.innerHTML = '<div class="preview-empty-state"><strong>Escolhe uma pergunta</strong><span>Abre uma pergunta para veres como fica para o cliente.</span></div>';
      return;
    }
    question = question || draftQuestionFromForm();
    const help = question.help_text ? `<span class="preview-question-help">${escapeHtmlAdmin(question.help_text)}</span>` : '';
    let field = '';
    if (question.input_type === 'choice_single' || question.input_type === 'choice_multiple') {
      field = (selectedQuestionOptions(question).length ? selectedQuestionOptions(question) : ['Primeira opção', 'Outra opção'])
        .map(option => `<span class="preview-option">${escapeHtmlAdmin(option)}</span>`).join('');
    } else if (question.input_type === 'file') {
      field = '<div class="preview-field">Clica aqui para adicionar um ficheiro</div>';
    } else {
      field = `<div class="preview-field">${escapeHtmlAdmin(question.placeholder || 'Escreve a tua resposta')}</div>`;
    }
    questionPreviewBody.innerHTML = `<label class="preview-question-label">${escapeHtmlAdmin(question.label)}${question.required ? ' *' : ''}</label>${help}${field}`;
  }

  function syncQuestionOptionsVisibility() {
    const choice = questionInputType?.value === 'choice_single' || questionInputType?.value === 'choice_multiple';
    if (questionOptionsWrap) questionOptionsWrap.style.display = choice ? 'grid' : 'none';
    renderQuestionPreview();
  }

  function openQuestionForm(question = null) {
    if (!questionEditorWrap) return;
    questionEditorWrap.style.display = 'block';
    if (questionEditorTitle) questionEditorTitle.textContent = question ? 'Editar pergunta' : 'Nova pergunta';
    setQuestionValue(questionId, question?.id || '');
    setQuestionValue(questionKey, question?.question_key || '');
    setQuestionValue(questionSectionKey, question?.section_key || 'projeto');
    setQuestionValue(questionSectionTitle, question?.section_title || 'Sobre o projeto');
    setQuestionValue(questionLabel, question?.label || '');
    setQuestionValue(questionHelp, question?.help_text || '');
    setQuestionValue(questionPlaceholder, question?.placeholder || 'Escreve a tua resposta');
    setQuestionValue(questionInputType, question?.input_type || 'textarea');
    setQuestionValue(questionOptions, selectedQuestionOptions(question).join('\n'));
    setQuestionValue(questionSortOrder, question?.sort_order || ((questionsCache.length || 0) + 1));
    setQuestionValue(questionMode, question?.mode || 'all');
    setQuestionChecked(questionRequired, question?.required);
    setQuestionValue(questionRole, question?.role || 'none');
    syncQuestionOptionsVisibility();
    renderQuestionPreview(question || draftQuestionFromForm());
    questionEditorWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    questionLabel?.focus();
  }

  function closeQuestionForm() {
    if (!questionEditorWrap) return;
    questionEditorWrap.style.display = 'none';
    questionForm?.reset();
    setQuestionValue(questionId, '');
    if (questionOptionsWrap) questionOptionsWrap.style.display = 'none';
    renderQuestionPreview(null);
  }

  addQuestionBtn?.addEventListener('click', () => openQuestionForm());
  cancelQuestionForm?.addEventListener('click', closeQuestionForm);
  if (cancelQuestionFormBottom) cancelQuestionFormBottom.addEventListener('click', closeQuestionForm);
  questionServiceFilter?.addEventListener('change', () => selectQuestionService(questionServiceFilter.value));
  if (questionSearch) questionSearch.addEventListener('input', renderQuestionsTable);
  if (questionInputType) questionInputType.addEventListener('change', syncQuestionOptionsVisibility);
  [questionLabel, questionHelp, questionPlaceholder, questionOptions].forEach(field => field?.addEventListener('input', () => renderQuestionPreview()));
  questionForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const options = (questionOptions?.value || '').split('\n').map(value => value.trim()).filter(Boolean).map(value => ({ label: value, value }));
    const existing = questionId?.value ? questionsCache.find(q => q.id === questionId.value) : null;
    const sectionKey = questionSectionKey?.value.trim() || `pergunta_${Date.now()}`;
    const payload = {
      service_type: questionServiceFilter?.value || 'identidade-visual',
      section_key: sectionKey,
      section_title: questionSectionTitle?.value.trim() || 'Sobre o projeto',
      question_key: makeQuestionKey(questionKey?.value.trim()) || existing?.question_key || makeQuestionKey(questionLabel?.value) || `${sectionKey}_${Date.now()}`,
      label: questionLabel?.value.trim(),
      help_text: questionHelp?.value.trim() || null,
      placeholder: questionPlaceholder?.value.trim() || 'Escreve a tua resposta',
      input_type: questionInputType?.value || 'textarea',
      options,
      required: Boolean(questionRequired?.checked),
      mode: questionMode?.value || 'all',
      role: questionRole?.value || 'none',
      sort_order: Number(questionSortOrder?.value) || 1,
      is_active: existing?.is_active ?? true,
    };
    try {
      if (questionId?.value) await updateBriefingQuestion(questionId.value, payload);
      else await createBriefingQuestion(payload);
      closeQuestionForm();
      await renderQuestionsTable();
      showToast('Pergunta guardada.');
    } catch (error) {
      console.error(error);
      showToast(`Erro ao guardar pergunta: ${error.message || 'verifica os campos.'}`, true);
    }
  });

  async function openBriefingDetails(b) {
    briefingDetailsTitle.textContent = `${b.client_name} — ${getCategoryLabel(b.service_type)}`;
    const entries = Object.entries(b.form_data || {});
    briefingDetailsBody.innerHTML = entries.map(([label, value]) => `
      <div style="margin-bottom:0.85rem;">
        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:0.2rem;">${escapeHtmlAdmin(label)}</div>
        <div style="white-space:pre-wrap;">${escapeHtmlAdmin(value)}</div>
      </div>
    `).join('') || '<p style="color:var(--text-muted);">Sem respostas registadas.</p>';
    briefingAttachmentList.innerHTML = '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:0.4rem;">Referências anexadas</div><div style="color:var(--text-muted);">A carregar...</div>';
    briefingDetailsDialog.style.display = 'flex';
    const attachments = await getBriefingAttachments(b.id);
    briefingAttachmentList.innerHTML = attachments.length
      ? `<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:0.4rem;">Referências anexadas</div>${attachments.map(file => `<div style="margin:.35rem 0;"><a href="${file.signed_url || '#'}" target="_blank" rel="noopener">${escapeHtmlAdmin(file.file_name)}</a></div>`).join('')}`
      : '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:0.4rem;">Referências anexadas</div><div style="color:var(--text-muted);">Nenhum ficheiro anexado.</div>';
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
     COMPRIMIR IMAGENS EXISTENTES NO NAVEGADOR
     A transformação nativa do Storage não está disponível neste tenant.
     Cada imagem é processada uma de cada vez e reenviada para o mesmo path.
  ══════════════════════════════════════════════════════ */
  const MAX_IMAGE_DIMENSION = 2200;
  const WEBP_QUALITY = 0.84;

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('O navegador não conseguiu gerar a imagem comprimida.'));
      }, type, quality);
    });
  }

  async function decodeImageForCompression(blob) {
    if ('createImageBitmap' in window) {
      const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    }

    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await image.decode();
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(objectUrl),
    };
  }

  async function compressExistingImagesInBrowser() {
    const { data: files, error: listError } = await supabaseClient
      .storage
      .from('project-images')
      .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

    if (listError) throw listError;

    const eligible = (files || []).filter(file => {
      const extension = (file.name.split('.').pop() || '').toLowerCase();
      return ['jpg', 'jpeg', 'png', 'webp'].includes(extension);
    });

    const totals = { processed: 0, skipped: 0, failed: 0, bytesBefore: 0, bytesAfter: 0 };
    compressImagesBtn.textContent = `A preparar... 0/${eligible.length}`;

    for (let index = 0; index < eligible.length; index += 1) {
      const file = eligible[index];
      const path = file.name;
      let decoded = null;
      let canvas = null;

      try {
        const { data: sourceBlob, error: downloadError } = await supabaseClient
          .storage
          .from('project-images')
          .download(path);
        if (downloadError || !sourceBlob) throw downloadError || new Error('download vazio');

        const originalBytes = sourceBlob.size;
        decoded = await decodeImageForCompression(sourceBlob);
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(decoded.width, decoded.height));
        const targetWidth = Math.max(1, Math.round(decoded.width * scale));
        const targetHeight = Math.max(1, Math.round(decoded.height * scale));

        canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const context = canvas.getContext('2d', { alpha: true });
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(decoded.source, 0, 0, targetWidth, targetHeight);

        const compressedBlob = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY);
        if (compressedBlob.size >= originalBytes) {
          totals.skipped += 1;
          console.log(`${path}: mantido (${(originalBytes / 1024).toFixed(0)}KB; WebP não reduziu)`);
          continue;
        }

        const { error: uploadError } = await supabaseClient
          .storage
          .from('project-images')
          .update(path, compressedBlob, {
            cacheControl: '3600',
            contentType: 'image/webp',
          });
        if (uploadError) throw uploadError;

        totals.processed += 1;
        totals.bytesBefore += originalBytes;
        totals.bytesAfter += compressedBlob.size;
        console.log(`${path}: ${(originalBytes / 1024).toFixed(0)}KB → ${(compressedBlob.size / 1024).toFixed(0)}KB`);
      } catch (error) {
        totals.failed += 1;
        console.error(`${path}: erro`, error);
      } finally {
        if (decoded) decoded.close();
        if (canvas) {
          canvas.width = 1;
          canvas.height = 1;
        }
        compressImagesBtn.textContent = `A comprimir... ${index + 1}/${eligible.length}`;
        // Liberta o ciclo de eventos entre imagens e reduz a pressão de memória.
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    return { totals, total: eligible.length };
  }

  compressImagesBtn.addEventListener('click', async () => {
    if (!confirm('Isto vai percorrer todas as imagens já enviadas, comprimi-las no teu navegador e guardá-las nos mesmos caminhos. Pode demorar vários minutos — não feches esta página. Continuar?')) {
      return;
    }

    compressImagesBtn.disabled = true;
    try {
      const { totals, total } = await compressExistingImagesInBrowser();
      const savedMB = Math.max(0, (totals.bytesBefore - totals.bytesAfter) / (1024 * 1024)).toFixed(1);
      showToast(`Concluído! ${totals.processed} imagens comprimidas, ${savedMB}MB poupados. (${totals.skipped} mantidas, ${totals.failed} falhas de ${total})`);
    } catch (error) {
      console.error(error);
      showToast('Erro ao listar ou comprimir imagens. Vê a consola para detalhes.', true);
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