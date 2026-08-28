/**
 * IMO — Intermediação de Mão-de-Obra
 * Design System GOV.BR — app.js
 * Lógica de: menu lateral, accordion, modais, tabela, paginação, seleção
 */

'use strict';

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function on(el, event, handler, options) {
  if (el) el.addEventListener(event, handler, options);
}

function off(el, event, handler) {
  if (el) el.removeEventListener(event, handler);
}

/* ============================================================
   MENU LATERAL — grupos expansíveis
   ============================================================ */

function initSidebar() {
  // Grupos expansíveis
  $$('.nav-group-header').forEach(header => {
    on(header, 'click', () => toggleNavGroup(header));
  });

  // Marcar item ativo pela URL
  highlightActiveNavItem();

  // Mobile: overlay fecha sidebar
  const overlay = $('#sidebar-overlay');
  on(overlay, 'click', closeMobileSidebar);

  // Botão fechar/menu no header para mobile
  const menuToggle = $('#mobile-menu-toggle');
  on(menuToggle, 'click', toggleMobileSidebar);
}

function toggleNavGroup(header) {
  const group = header.closest('.nav-group');
  const children = $('.nav-group-children', group);
  const isOpen = header.classList.contains('open');

  if (isOpen) {
    header.classList.remove('open');
    children.classList.remove('expanded');
  } else {
    header.classList.add('open');
    children.classList.add('expanded');
  }
}

function openNavGroup(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const header = $('.nav-group-header', group);
  const children = $('.nav-group-children', group);
  if (header && children) {
    header.classList.add('open');
    children.classList.add('expanded');
  }
}

function highlightActiveNavItem() {
  const path = window.location.pathname.split('/').pop() || 'visualizar-vaga.html';
  const allLinks = $$('.nav-item, .nav-subitem');
  allLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && path.includes(href.split('/').pop())) {
      link.classList.add('active');
      // Expande o grupo pai, se houver
      const group = link.closest('.nav-group');
      if (group) {
        const header = $('.nav-group-header', group);
        const children = $('.nav-group-children', group);
        if (header) header.classList.add('open');
        if (children) children.classList.add('expanded');
      }
    }
  });
}

function toggleMobileSidebar() {
  const sidebar = $('.govbr-sidebar');
  const overlay = $('#sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('mobile-open');
  if (overlay) overlay.classList.toggle('active');
  document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
}

function closeMobileSidebar() {
  const sidebar = $('.govbr-sidebar');
  const overlay = $('#sidebar-overlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   ACCORDION GOV.BR
   ============================================================ */

function initAccordions() {
  $$('.accordion-header').forEach(header => {
    on(header, 'click', () => toggleAccordion(header));
    // Acessibilidade: Enter e Space
    on(header, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(header);
      }
    });
  });
}

function toggleAccordion(header) {
  const accordion = header.closest('.govbr-accordion');
  const body = $('.accordion-body', accordion);
  const isOpen = header.classList.contains('open');

  if (isOpen) {
    header.classList.remove('open');
    body.classList.remove('expanded');
    header.setAttribute('aria-expanded', 'false');
  } else {
    header.classList.add('open');
    body.classList.add('expanded');
    header.setAttribute('aria-expanded', 'true');
  }
}

function openAccordion(accordionId) {
  const accordion = document.getElementById(accordionId);
  if (!accordion) return;
  const header = $('.accordion-header', accordion);
  const body = $('.accordion-body', accordion);
  if (header && body) {
    header.classList.add('open');
    body.classList.add('expanded');
    header.setAttribute('aria-expanded', 'true');
  }
}

function closeAccordion(accordionId) {
  const accordion = document.getElementById(accordionId);
  if (!accordion) return;
  const header = $('.accordion-header', accordion);
  const body = $('.accordion-body', accordion);
  if (header && body) {
    header.classList.remove('open');
    body.classList.remove('expanded');
    header.setAttribute('aria-expanded', 'false');
  }
}

/* ============================================================
   MODAIS GOV.BR
   ============================================================ */

function initModals() {
  // Abre modal por botão com data-modal-target
  $$('[data-modal-target]').forEach(btn => {
    on(btn, 'click', () => {
      const id = btn.getAttribute('data-modal-target');
      openModal(id);
    });
  });

  // Fecha modal pelo botão de fechar ou "Voltar"
  $$('[data-modal-close]').forEach(btn => {
    on(btn, 'click', () => {
      const id = btn.getAttribute('data-modal-close') || btn.closest('.govbr-modal-overlay')?.id;
      if (id) closeModal(id);
    });
  });

  // Fecha ao clicar no overlay (fora do modal)
  $$('.govbr-modal-overlay').forEach(overlay => {
    on(overlay, 'click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Fecha com ESC
  on(document, 'keydown', e => {
    if (e.key === 'Escape') {
      const openOverlay = $('.govbr-modal-overlay.active');
      if (openOverlay) closeModal(openOverlay.id);
    }
  });
}

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Foco no primeiro elemento focável
  const focusable = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', overlay);
  if (focusable.length) setTimeout(() => focusable[0].focus(), 50);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('active');
  // Só remove o overflow se não houver outro modal aberto
  if (!$('.govbr-modal-overlay.active')) {
    document.body.style.overflow = '';
  }
}

/* ============================================================
   SELEÇÃO DE LINHAS NA TABELA
   ============================================================ */

function initTableSelection(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const masterCheckbox = $('[data-select-all]', table);
  const rowCheckboxes  = $$('[data-row-checkbox]', table);

  if (masterCheckbox) {
    on(masterCheckbox, 'change', () => {
      const checked = masterCheckbox.checked;
      rowCheckboxes.forEach(cb => {
        cb.checked = checked;
        toggleRowHighlight(cb, checked);
      });
      updateSelectCount(tableId);
    });
  }

  rowCheckboxes.forEach(cb => {
    on(cb, 'change', () => {
      toggleRowHighlight(cb, cb.checked);
      syncMasterCheckbox(masterCheckbox, rowCheckboxes);
      updateSelectCount(tableId);
    });
  });
}

function toggleRowHighlight(checkbox, selected) {
  const row = checkbox.closest('tr');
  if (row) {
    row.classList.toggle('row-selected', selected);
  }
}

function syncMasterCheckbox(master, rows) {
  if (!master) return;
  const checkedCount = rows.filter(r => r.checked).length;
  master.checked = checkedCount === rows.length && rows.length > 0;
  master.indeterminate = checkedCount > 0 && checkedCount < rows.length;
}

function updateSelectCount(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const checked = $$('[data-row-checkbox]:checked', table).length;
  const counter = $(`[data-select-count="${tableId}"]`);
  if (counter) counter.textContent = checked;

  // Habilita/desabilita botões de ação em lote
  const actionBtns = $$('[data-require-selection]');
  actionBtns.forEach(btn => {
    btn.disabled = checked === 0;
    btn.style.opacity = checked === 0 ? '.5' : '1';
  });
}

/* ============================================================
   PAGINAÇÃO
   ============================================================ */

function initPagination(options = {}) {
  const {
    containerId = 'pagination',
    totalItems  = 3,
    pageSize    = 10,
    currentPage = 1,
  } = options;

  const container = document.getElementById(containerId);
  if (!container) return;

  renderPaginationInfo(container, totalItems, pageSize, currentPage);

  const prevBtn = $('[data-page-prev]', container);
  const nextBtn = $('[data-page-next]', container);
  const pageSelect = $('[data-page-select]', container);
  const sizeSelect = $('[data-page-size]', container);

  if (prevBtn) on(prevBtn, 'click', () => changePage(containerId, -1));
  if (nextBtn) on(nextBtn, 'click', () => changePage(containerId,  1));
  if (pageSelect) on(pageSelect, 'change', e => goToPage(containerId, parseInt(e.target.value)));
  if (sizeSelect) on(sizeSelect, 'change', e => changePageSize(containerId, parseInt(e.target.value)));
}

function renderPaginationInfo(container, totalItems, pageSize, currentPage) {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end   = Math.min(currentPage * pageSize, totalItems);
  const count = $('[data-pagination-count]', container);
  if (count) count.textContent = `${start}-${end} de ${totalItems} trabalhadores`;
}

function changePage(containerId, delta) {
  // Implementação simplificada para o protótipo
  console.log('Mudar página:', delta);
}

function goToPage(containerId, page) {
  console.log('Ir para página:', page);
}

function changePageSize(containerId, size) {
  console.log('Tamanho de página:', size);
}

/* ============================================================
   FILTROS
   ============================================================ */

function initFilters() {
  const filterForm = $('#filter-form');
  if (!filterForm) return;

  on(filterForm, 'submit', e => {
    e.preventDefault();
    applyFilters();
  });

  const filterBtn = $('[data-filter-btn]');
  on(filterBtn, 'click', e => {
    e.preventDefault();
    applyFilters();
  });
}

function applyFilters() {
  const id         = ($('#filter-id')        || {}).value || '';
  const condicao   = ($('#filter-condicao')  || {}).value || '';
  const municipio  = ($('#filter-municipio') || {}).value || '';

  console.log('Filtros aplicados:', { id, condicao, municipio });
  // Neste protótipo, apenas simula a ação
  showToast('Filtros aplicados com sucesso.', 'success');
}

/* ============================================================
   MODAL FLEXIBILIZAR
   ============================================================ */

function initFlexibilizar() {
  const btn = $('#btn-flexibilizar');
  on(btn, 'click', () => openModal('modal-flexibilizar'));

  const flexForm = $('#flex-form');
  on(flexForm, 'submit', e => {
    e.preventDefault();
    const checks = $$('#flex-form input[type=checkbox]:checked');
    const selecionados = checks.map(c => c.value);
    if (selecionados.length === 0) {
      showToast('Selecione ao menos um critério para flexibilizar.', 'warning');
      return;
    }
    console.log('Critérios flexibilizados:', selecionados);
    closeModal('modal-flexibilizar');
    showToast(`Critérios flexibilizados: ${selecionados.join(', ')}.`, 'success');
  });
}

/* ============================================================
   CONVOCAR TRABALHADORES
   ============================================================ */

function initConvocar() {
  const btnEmail = $('[data-convocar-email]');
  const btnCtps  = $('[data-convocar-ctps]');

  on(btnEmail, 'click', () => {
    const selecionados = getSelectedWorkers();
    if (selecionados.length === 0) {
      showToast('Selecione ao menos um trabalhador para convocar.', 'warning');
      return;
    }
    console.log('Convocar por e-mail:', selecionados);
    showToast(`${selecionados.length} trabalhador(es) convocado(s) por e-mail.`, 'success');
  });

  on(btnCtps, 'click', () => {
    const selecionados = getSelectedWorkers();
    if (selecionados.length === 0) {
      showToast('Selecione ao menos um trabalhador para convocar.', 'warning');
      return;
    }
    console.log('Notificar pela CTPS Digital:', selecionados);
    showToast(`${selecionados.length} trabalhador(es) notificado(s) pela CTPS Digital.`, 'success');
  });
}

function getSelectedWorkers() {
  return $$('[data-row-checkbox]:checked').map(cb => cb.value);
}

/* ============================================================
   TOAST / FEEDBACK
   ============================================================ */

function showToast(message, type = 'info') {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      z-index: 3000; display: flex; flex-direction: column; gap: 8px;
    `;
    document.body.appendChild(container);
  }

  const colorMap = {
    success: { bg: '#e3f5e1', border: '#168821', text: '#0b5214', icon: '✓' },
    warning: { bg: '#fdf5ce', border: '#856404', text: '#856404', icon: '⚠' },
    danger:  { bg: '#fee7e5', border: '#e52207', text: '#a01400', icon: '✕' },
    info:    { bg: '#d4e5ff', border: '#155bcb', text: '#0c326f', icon: 'ℹ' },
  };
  const c = colorMap[type] || colorMap.info;

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${c.bg}; border-left: 4px solid ${c.border};
    color: ${c.text}; padding: 12px 16px;
    border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,.16);
    font-size: 14px; font-family: var(--font-base);
    max-width: 360px; display: flex; align-items: flex-start; gap: 8px;
    animation: fadeIn .2s ease;
  `;
  toast.innerHTML = `<span style="font-weight:700;flex-shrink:0">${c.icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ============================================================
   VER MAIS (Soft Skills)
   ============================================================ */

function initVerMais() {
  const btn = $('#btn-ver-mais');
  if (!btn) return;

  const extra = $('#soft-skills-extra');

  on(btn, 'click', () => {
    if (!extra) return;
    const isHidden = extra.style.display === 'none' || !extra.style.display;
    extra.style.display = isHidden ? 'flex' : 'none';
    btn.textContent = isHidden ? 'Ver menos' : 'Ver mais';
  });
}

/* ============================================================
   BREADCRUMB — navegação
   ============================================================ */

function initBreadcrumb() {
  // Breadcrumb é apenas markup, sem JS necessário
}

/* ============================================================
   INICIALIZAÇÃO GLOBAL
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initAccordions();
  initModals();
  initFilters();

  // Tela index / detalhes-vaga
  if (document.getElementById('table-trabalhadores')) {
    initTableSelection('table-trabalhadores');
    initPagination({ containerId: 'pagination-trabalhadores', totalItems: 3 });
    initFlexibilizar();
    initConvocar();
    initVerMais();
  }

  // Expande automaticamente o grupo "Gestão de vagas" no menu
  openNavGroup('nav-group-gestao');
});

/* ============================================================
   EXPORTA funções globais utilizadas nos atributos HTML
   ============================================================ */
window.openModal    = openModal;
window.closeModal   = closeModal;
window.showToast    = showToast;
window.openAccordion  = openAccordion;
window.closeAccordion = closeAccordion;

/* ============================================================
   TABS GOV.BR — cadastro-trabalhador.html
   ============================================================ */

function initTabs() {
  const tabBtns = $$('.govbr-tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    on(btn, 'click', () => activateTab(btn));

    // Navegação por teclado (←→ entre tabs)
    on(btn, 'keydown', e => {
      const all   = $$('.govbr-tab-btn');
      const index = all.indexOf(btn);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = all[(index + 1) % all.length];
        activateTab(next); next.focus();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = all[(index - 1 + all.length) % all.length];
        activateTab(prev); prev.focus();
      }
    });
  });
}

function activateTab(btn) {
  // Desativa todos
  $$('.govbr-tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  $$('.govbr-tab-panel').forEach(p => p.classList.remove('active'));

  // Ativa o selecionado
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  const panelId = btn.getAttribute('aria-controls');
  if (panelId) {
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  }
}

/* ============================================================
   ATUALIZA INICIALIZAÇÃO GLOBAL com suporte às novas telas
   ============================================================ */

// Sobrescreve o listener DOMContentLoaded anterior de forma aditiva
document.addEventListener('DOMContentLoaded', () => {
  initTabs();

  // Destaca item de menu ativo nas novas telas
  const path = window.location.pathname.split('/').pop();
  if (path === 'detalhes-batimento.html' || path === 'cadastro-trabalhador.html') {
    // Abre e destaca "Gestão de vagas > Informações da vaga" como contexto pai
    openNavGroup('nav-group-gestao');
  }
});
