/**
 * admin.js — Admin Panel Logic
 * Lucas Muindi Portfolio
 * Password: admin2025 (change in ADMIN_PASS constant)
 */

(function () {
  'use strict';

  /* ─── CONFIG ──────────────────────────────────────────── */
  const ADMIN_PASS    = 'admin2025';
  const SESSION_KEY   = 'lm_admin_session';
  const SESSION_VALUE = 'authenticated';

  /* ─── DOM ─────────────────────────────────────────────── */
  const loginScreen   = document.getElementById('loginScreen');
  const adminPanel    = document.getElementById('adminPanel');
  const loginForm     = document.getElementById('loginForm');
  const loginPassword = document.getElementById('loginPassword');
  const loginError    = document.getElementById('loginError');
  const logoutBtn     = document.getElementById('logoutBtn');
  const pageTitle     = document.getElementById('pageTitle');

  // Navigation
  const sidebarLinks  = document.querySelectorAll('.sidebar-link[data-view]');
  const views         = {
    dashboard: document.getElementById('viewDashboard'),
    projects:  document.getElementById('viewProjects'),
    add:       document.getElementById('viewAdd'),
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
  const imageUrlList  = document.getElementById('imageUrlList');
  const addUrlBtn     = document.getElementById('addUrlBtn');
  const imagePreviewGrid = document.getElementById('imagePreviewGrid');

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
  const importFile = document.getElementById('importFile');

  // Confirm Dialog
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmCancel = document.getElementById('confirmCancel');
  const confirmDelete = document.getElementById('confirmDelete');

  // Toast
  const toast = document.getElementById('toast');

  // State
  let pendingDeleteId = null;
  let uploadedImages  = [];   // base64 data URLs from upload

  /* ══════════════════════════════════════════════════════
     AUTH
  ══════════════════════════════════════════════════════ */
  function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE;
  }

  function authorize() {
    loginScreen.style.display = 'none';
    adminPanel.style.display  = 'flex';
    showView('dashboard');
  }

  function deauthorize() {
    sessionStorage.removeItem(SESSION_KEY);
    loginScreen.style.display = 'flex';
    adminPanel.style.display  = 'none';
    loginPassword.value = '';
  }

  // Check session on load
  if (isAuthenticated()) {
    authorize();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = loginPassword.value.trim();
    if (val === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, SESSION_VALUE);
      loginError.classList.remove('show');
      authorize();
    } else {
      loginError.classList.add('show');
      loginPassword.value = '';
      loginPassword.focus();
    }
  });

  logoutBtn.addEventListener('click', () => {
    if (confirm('Tens a certeza que queres sair?')) deauthorize();
  });

  /* ══════════════════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════════════════ */
  const viewTitles = {
    dashboard: 'Dashboard',
    projects:  'Todos os Projetos',
    add:       'Novo Projeto',
  };

  function showView(viewName) {
    Object.entries(views).forEach(([name, el]) => {
      el.style.display = name === viewName ? 'block' : 'none';
    });
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });
    pageTitle.textContent = viewTitles[viewName] || viewName;

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'projects')  renderProjectsTable();
    if (viewName === 'add') {
      resetForm();
    }
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => showView(link.dataset.view));
  });

  /* ══════════════════════════════════════════════════════
     DASHBOARD
  ══════════════════════════════════════════════════════ */
  function renderDashboard() {
    const counts = getCategoryCounts();
    const labels = {
      all: 'Total de Projetos',
      'identidade-visual': 'Identidade Visual',
      'social-media': 'Social Media',
      'motion': 'Motion',
      'editorial': 'Editorial',
      'web-design': 'Web Design',
      'embalagem': 'Embalagem',
    };

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
    const projects = getProjects().sort((a, b) => b.order - a.order).slice(0, 6);
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

  function renderProjectsTable() {
    let projects = getProjects().sort((a, b) => a.order - b.order);

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
  window.handleMove = (id, dir) => {
    moveProject(id, dir);
    renderProjectsTable();
  };

  window.handleToggle = (id) => {
    toggleProjectVisibility(id);
    renderProjectsTable();
    showToast('Visibilidade atualizada.');
  };

  window.handleEdit = (id) => {
    const p = getProjectById(id);
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

  confirmDelete.addEventListener('click', () => {
    if (pendingDeleteId) {
      deleteProject(pendingDeleteId);
      pendingDeleteId = null;
      confirmDialog.style.display = 'none';
      renderProjectsTable();
      renderDashboard();
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
  }

  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    };

    const id = editIdInput.value;
    if (id) {
      updateProject(id, data);
      showToast('Projeto atualizado com sucesso!');
    } else {
      addProject(data);
      showToast('Projeto adicionado com sucesso!');
    }

    showView('projects');
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

  /* ─── FILE UPLOAD ───────────────────────────────────────── */
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
    files.filter(f => f.type.startsWith('image/')).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        uploadedImages.push(dataUrl);
        addUploadThumb(dataUrl);
        const urls = Array.from(imageUrlList.querySelectorAll('.image-url-input'))
          .map(i => i.value.trim()).filter(Boolean);
        updatePreviewGrid([...urls, ...uploadedImages]);
      };
      reader.readAsDataURL(file);
    });
  }

  function addUploadThumb(src) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;width:60px;height:45px;border-radius:4px;overflow:hidden;';
    wrap.innerHTML = `
      <img src="${src}" style="width:100%;height:100%;object-fit:cover;">
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
     EXPORT / IMPORT
  ══════════════════════════════════════════════════════ */
  exportBtn.addEventListener('click', () => {
    const json = exportData();
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
    reader.onload = (ev) => {
      try {
        importData(ev.target.result);
        showToast('Dados importados com sucesso!');
        renderDashboard();
        if (views.projects.style.display !== 'none') renderProjectsTable();
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
