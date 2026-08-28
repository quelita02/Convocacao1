# Plano de Implementação: Convocação e Lista de Vagas

## Visão Geral

Reorganização do fluxo de convocação no protótipo estático GOV.BR (HTML/CSS/JS, sem build). O trabalho se divide em três arquivos independentes e um checkpoint de verificação:

- **Grupo 1 — `convocacao.html` (novo):** casca padrão do protótipo + card de identificação da vaga + metade inferior migrada de `visualizar-vaga.html` (Critérios, Filtros, Trabalhadores e botões de convocação) + modais migrados + script inline de filtros avançados.
- **Grupo 2 — `visualizar-vaga.html`:** remover a metade inferior, os três modais migrados e o script inline dos filtros avançados; manter a metade superior.
- **Grupo 3 — `lista-vagas.html`:** ajustar tooltip da lupa, remover a coluna de status, ajustar o CSS local, inserir o boneco como 2ª ação e redirecionar o botão "Simular Trabalhadores".
- **Grupo 4 — Checkpoint (opcional):** verificar a Property 1 sobre as 10 linhas de `#table-vagas`.

`app.js` NÃO é alterado (a inicialização do fluxo de trabalhadores é condicional à presença de `#table-trabalhadores`).

## Tasks

- [x] 1. Criar `convocacao.html` (nova página com o fluxo de convocação migrado)
  - [x] 1.1 Montar a casca padrão do protótipo em `convocacao.html`
    - Criar o `<head>` com `style.css` e Font Awesome via CDN; adicionar `skip-link` (#main-content), `header.govbr-header`, `#sidebar-overlay`, `nav.barra-atendimento-topo`, `.app-layout` com `nav.govbr-sidebar` + `main.main-content#main-content`, `footer.barra-atendimento` e `#modal-finalizar-atendimento`, copiando a marcação real das páginas existentes do protótipo
    - Adicionar `<script src="app.js">` ao final do `<body>`
    - _Requirements: 4.1, 4.5, 4.9_
  - [x] 1.2 Adicionar cabeçalho da página e card de identificação da vaga
    - Inserir `.page-header` com `.page-back-btn` (href `lista-vagas.html`, aria-label "Voltar à lista de vagas") e `<h1 class="page-title">Convocação</h1>`
    - Inserir `.govbr-card` com `.vaga-info-row` contendo os campos Código (`2525-05`) e Título
    - _Requirements: 4.6, 4.7, 4.8_
  - [x] 1.3 Migrar a metade inferior de `visualizar-vaga.html` para `convocacao.html`
    - Copiar a `<section class="criterios-section">` (botão `#btn-flexibilizar` com `data-modal-target="modal-flexibilizar"`)
    - Copiar a `<section class="filtros-section">` (`#filter-form`, campos de filtro, link `#link-mais-filtros` com `data-modal-target="modal-filtros-avancados"` e botão `[data-filter-btn]`)
    - Copiar a `<section class="table-section">` completa (botão "Legenda", tabela `#table-trabalhadores` com `[data-select-all]`/`[data-row-checkbox]` e coluna "Ações", paginação `#pagination-trabalhadores` e `.table-footer` com os botões `[data-convocar-email]` e `[data-convocar-ctps]`)
    - _Requirements: 4.2, 4.3, 4.11_
  - [x] 1.4 Migrar os modais e o script inline de filtros avançados para `convocacao.html`
    - Copiar os modais `#modal-flexibilizar`, `#modal-legenda` e `#modal-filtros-avancados` com marcação idêntica à de `visualizar-vaga.html`
    - Copiar o `<script>` inline do bloco `#form-filtros-avancados` (funções `coletarFiltros`, `renderizarTags`, botão `#btn-limpar-filtros`, badge em `#link-mais-filtros`), posicionando-o DEPOIS de `<script src="app.js">`
    - _Requirements: 4.4, 4.10_

- [x] 2. Reduzir `visualizar-vaga.html` à metade superior
  - [x] 2.1 Remover a metade inferior, os modais migrados e o script inline
    - Remover as seções `criterios-section`, `filtros-section` e a `table-section` de Trabalhadores (`#table-trabalhadores`, paginação e botões `[data-convocar-email]`/`[data-convocar-ctps]`)
    - Remover os modais `#modal-flexibilizar`, `#modal-legenda` e `#modal-filtros-avancados`
    - Remover o `<script>` inline dos filtros avançados (bloco `#form-filtros-avancados`)
    - Manter a metade superior (card Código/Título + accordion "Exibir detalhes"), header, barras, sidebar, botão Voltar (href `lista-vagas.html`), `#modal-finalizar-atendimento` e `<script src="app.js">`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 3. Ajustar `lista-vagas.html` (tabela, CSS e navegação)
  - [x] 3.1 Ajustar tooltip da lupa nas 10 linhas
    - Trocar `title` e `aria-label` de "Visualizar a vaga e encaminhar trabalhador" para "Visualizar a vaga", mantendo `href="visualizar-vaga.html?vaga=XXXX"` e `<i class="fa-solid fa-magnifying-glass">`
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 3.2 Remover a coluna de status da tabela `#table-vagas`
    - Remover o `<th>` vazio inicial do `<thead>` e todas as 10 `<td class="vaga-status-cell">` do corpo, deixando a tabela com 7 colunas (Identificação, Data de cadastro, Cargo, Quant., Status, Contratação, Ações)
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 3.3 Ajustar o `<style>` local de `lista-vagas.html`
    - Remover a regra `#table-vagas thead th:first-child, #table-vagas tbody td:first-child { width:40px; text-align:center; }`
    - Remover as classes `.vaga-status-icon`, `.vaga-status-icon--interesse` e `.vaga-status-icon--convocacao`
    - Adicionar a classe `.btn-icon-action--disabled` (`opacity:.45; cursor:not-allowed; pointer-events:none; background:transparent; color:var(--color-text-secondary)`)
    - _Requirements: 2.1, 3.6_
  - [x] 3.4 Inserir o boneco como 2ª ação em cada `.vagas-actions-cell` (ordem lupa → boneco → gestão)
    - Linhas de convocação (ids 101039, 101001, 100999, 100920, 100319): `<a class="btn-icon-action" href="convocacao.html?vaga=XXXX">` com `title`/`aria-label` "Essa vaga está disponível para convocação" e `<i class="fa-solid fa-user">`
    - Linhas de interesse (ids 101040, 101002, 101000, 100922, 100522): `<span class="btn-icon-action btn-icon-action--disabled" role="img" aria-disabled="true">` com `title`/`aria-label` "Essa vaga está disponível para manifestação de interesse" e `<i class="fa-solid fa-user-slash" aria-hidden="true">`
    - Usar sempre o identificador da própria linha nos `href` navegáveis
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_
  - [x] 3.5 Redirecionar o botão "Simular Trabalhadores"
    - Trocar o `onclick` de `window.location.href='visualizar-vaga.html'` para `window.location.href='convocacao.html'`
    - _Requirements: 6.1, 6.2_

- [x] 4. Checkpoint - Verificação da tabela de vagas
  - [x]* 4.1 Verificar a Property 1 nas 10 linhas de `#table-vagas`
    - **Property 1: Estrutura da coluna de ações e destinos da tabela de vagas**
    - **Validates: Requirements 1.1, 1.2, 1.3, 2.2, 2.3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.9**
    - Confirmar 7 colunas e ausência de `td.vaga-status-cell` em toda linha
    - Confirmar 3 ações por linha na ordem lupa → boneco → gestão
    - Confirmar lupa `<a>` → `visualizar-vaga.html?vaga=<id>` com title "Visualizar a vaga"; gestão `<a>` → `gestao-encaminhamentos.html?vaga=<id>`
    - Confirmar boneco de convocação `<a href="convocacao.html?vaga=<id>">` e boneco de interesse desabilitado sem navegação (`aria-disabled="true"`), sempre com o mesmo `id` da linha
    - Ensure all tests pass, ask the user if questions arise.

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido.
- Cada tarefa referencia critérios de aceitação específicos para rastreabilidade.
- `app.js` não é alterado nesta feature (a inicialização do fluxo de trabalhadores é condicional à presença de `#table-trabalhadores`).
- Os grupos 1, 2 e 3 atuam em arquivos distintos e podem ser executados em paralelo; dentro de cada grupo, as sub-tarefas que tocam o mesmo arquivo são sequenciais.
- O checkpoint da tarefa 4 depende da conclusão do grupo 3 (`lista-vagas.html`).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "3.1"] },
    { "id": 1, "tasks": ["1.2", "3.2"] },
    { "id": 2, "tasks": ["1.3", "3.3"] },
    { "id": 3, "tasks": ["1.4", "3.4"] },
    { "id": 4, "tasks": ["3.5"] },
    { "id": 5, "tasks": ["4.1"] }
  ]
}
```
