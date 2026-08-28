# Documento de Design

## Visão Geral

Este design descreve a reorganização do fluxo de convocação de trabalhadores no protótipo estático GOV.BR do sistema IMO. O objetivo é separar responsabilidades entre três páginas:

- `lista-vagas.html` — passa a expor a convocação como uma **ação** na coluna "Ações" (transformando o antigo indicador de status "boneco" em um ícone acionável), e remove a coluna inicial de status.
- `visualizar-vaga.html` — passa a exibir **apenas os dados descritivos da vaga** (metade superior: card Código/Título + accordion "Exibir detalhes").
- `convocacao.html` — **nova página** que recebe todo o fluxo operacional migrado da metade inferior de `visualizar-vaga.html` (Critérios flexíveis, Filtros, Trabalhadores e botões de convocação), além dos modais associados.

O protótipo é estático (HTML + CSS + JS). Reutiliza o `style.css` compartilhado, o `app.js` compartilhado e ícones Font Awesome via CDN. **Não há back-end.**

### Decisão-chave: `app.js` NÃO precisa de alterações

Foi confirmado por leitura de `app.js` que a inicialização do fluxo de trabalhadores é **condicional à presença de `#table-trabalhadores`**:

```javascript
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
  ...
});
```

Consequências:

- Em `convocacao.html`, como `#table-trabalhadores` **estará presente**, o `app.js` inicializará automaticamente `initTableSelection`, `initPagination`, `initFlexibilizar`, `initConvocar` e `initVerMais`, além de `initModals` e `initFilters` (que rodam sempre). **Nenhuma alteração em `app.js`.**
- Em `visualizar-vaga.html`, como `#table-trabalhadores` **deixará de existir**, o bloco condicional simplesmente não roda — e não há erro, pois `initTableSelection`, `initPagination`, `initFlexibilizar`, `initConvocar` e `initVerMais` já tratam a ausência dos seus elementos (`if (!table) return;`, `if (!btn) return;`, etc.). `initModals`, `initFilters` e `initAccordions` também tratam ausência de alvos. **Nenhuma alteração em `app.js`.**
- `highlightActiveNavItem` usa `window.location.pathname` para marcar o item de menu; funciona igualmente para `convocacao.html` (nenhum item de submenu aponta para `convocacao.html`, então nada será marcado como ativo indevidamente — comportamento aceitável para o protótipo).
- `showToast`, `openModal`/`closeModal` são globais (`window.*`) e permanecem disponíveis para o `<script>` inline de filtros avançados na nova página.

## Arquitetura

```
┌────────────────────┐      lupa (visualizar)      ┌────────────────────────┐
│  lista-vagas.html  │ ──────────────────────────▶ │  visualizar-vaga.html  │
│  (tabela #table-   │                             │  (SÓ metade superior:  │
│   vagas, 7 colunas)│      boneco fa-user          │  card + accordion)     │
│                    │ ──── (convocação) ─────┐    └────────────────────────┘
│  Ações por linha:  │                        │
│  [lupa][boneco]    │      boneco fa-user-    │    ┌────────────────────────┐
│  [gestão]          │      slash (interesse,  ▼    │    convocacao.html      │
│                    │      DESABILITADO)     ─────▶│  (metade inferior       │
│  "Simular Trab."   │ ──────────────────────────▶ │   migrada + 3 modais    │
└────────────────────┘        gestão ──▶ gestao-    │   + script inline)      │
                              encaminhamentos.html   └────────────────────────┘
```

Fluxo de navegação por linha da tabela de vagas:

| Ícone | Font Awesome | Destino / comportamento |
|---|---|---|
| Lupa | `fa-magnifying-glass` | `visualizar-vaga.html?vaga=<id>` |
| Boneco (convocação, sem "x") | `fa-user` | `convocacao.html?vaga=<id>` (navega) |
| Boneco (interesse, com "x") | `fa-user-slash` | **desabilitado** — não navega |
| Gestão | `fa-people-arrows` | `gestao-encaminhamentos.html?vaga=<id>` |

## Componentes e Interfaces

### 1. `lista-vagas.html`

#### 1a. Ícone de lupa (tooltip)

Mantém o `href` e o ícone; ajusta apenas os textos acessíveis.

- **Manter:** `href="visualizar-vaga.html?vaga=XXXX"` e `<i class="fa-solid fa-magnifying-glass">`.
- **Alterar:** `title` e `aria-label` de `"Visualizar a vaga e encaminhar trabalhador"` (valor atual em todas as 10 linhas) para **`"Visualizar a vaga"`**.

> Observação de estado atual: hoje a lupa está com `title="Visualizar a vaga e encaminhar trabalhador"`. Este texto será substituído em todas as 10 linhas.

#### 1b. Remoção da coluna de status (1ª coluna)

- **Cabeçalho:** remover o primeiro `<th scope="col"></th>` (vazio) do `<thead>`. A tabela passa a ter 7 `<th>`: `Identificação`, `Data de cadastro`, `Cargo`, `Quant.`, `Status`, `Contratação`, `Ações`.
- **Corpo:** remover **todas** as `<td class="vaga-status-cell">...</td>` (uma por linha, 10 no total). Cada linha passa a ter 7 `<td>`.

##### Ajuste do CSS local

O `<style>` de `lista-vagas.html` contém uma regra que forçava a 1ª coluna a 40px e centralizada — que existia por causa da coluna de status:

```css
/* Primeira coluna estreita para o indicador de status */
#table-vagas thead th:first-child,
#table-vagas tbody td:first-child { width: 40px; text-align: center; }
```

**Decisão: remover esta regra.** Após a remoção da coluna de status, a 1ª coluna passa a ser "Identificação", que **não** deve ser estreitada a 40px nem centralizada. Manter a regra prejudicaria a leitura da coluna de identificação. Não há substituta necessária: a coluna de identificação usa o estilo padrão de `.govbr-table`.

##### Classes `.vaga-status-icon` / `--interesse` / `--convocacao`

Essas classes são definidas **localmente** no `<style>` de `lista-vagas.html`:

```css
.vaga-status-icon { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; font-size:var(--font-size-scale-base); color:var(--color-text-secondary); }
.vaga-status-icon--interesse { color: var(--color-primary); }
.vaga-status-icon--convocacao { color: var(--color-text-secondary); }
```

Verificação realizada:
- `.vaga-status-icon` **não** está definida em `style.css` (busca sem resultado).
- Outras páginas (`gestao-encaminhamentos.html`, `detalhes-batimento.html`) até **usam** a classe `.vaga-status-icon`, porém **cada página tem seu próprio `<style>` escopado ao documento**; a definição que está em `lista-vagas.html` nunca se aplicou a essas outras páginas (CSS `<style>` é por documento, não global entre HTMLs separados).

**Decisão: remover as três regras `.vaga-status-icon`, `.vaga-status-icon--interesse` e `.vaga-status-icon--convocacao` do `<style>` local de `lista-vagas.html`.** Motivos: (1) após a migração, a tabela de vagas passa a usar `.btn-icon-action` (o "boneco" vira ação), tornando essas classes órfãs em `lista-vagas.html`; (2) removê-las de `lista-vagas.html` **não afeta** `gestao-encaminhamentos.html` nem `detalhes-batimento.html`, pois cada uma é um documento independente. Se `gestao-encaminhamentos.html` depende visualmente dessas classes, isso é responsabilidade daquele documento e está fora do escopo desta feature.

#### 1c. Boneco na coluna de Ações (2º ícone)

O "boneco" migra da antiga coluna de status para dentro de `.vagas-actions-cell`, tornando-se a **2ª ação**, na ordem: **lupa → boneco → gestão**.

**Nova classe CSS necessária** (para o estado desabilitado do boneco de interesse), a ser adicionada ao `<style>` local de `lista-vagas.html`, logo após a definição de `.btn-icon-action` (que vive em `style.css`):

```css
/* Ação desabilitada (boneco de manifestação de interesse) */
.btn-icon-action--disabled {
  opacity: .45;
  cursor: not-allowed;
  pointer-events: none;      /* impede clique/hover navegável */
  background: transparent;
  color: var(--color-text-secondary);
}
```

Racional: baseia-se nos tokens já existentes (`--color-text-secondary`) e no padrão de "desabilitado" já usado no projeto (ex.: `.pagination-btn:disabled { opacity:.4; cursor:not-allowed; }`). `pointer-events:none` garante que o elemento não seja navegável nem receba o `:hover` que muda para azul.

**Técnica de acessibilidade escolhida para o estado desabilitado:** usar um elemento **`<span>`** (não `<a>`), pois não há destino de navegação. Um `<span>` naturalmente não é navegável por teclado nem por clique, o que é semanticamente mais correto do que um `<a>` sem `href`. Complementa-se com `role="img"` (é um indicador visual), `aria-disabled="true"` e `title`/`aria-label` descritivos. A classe `.btn-icon-action--disabled` reforça visualmente (esmaecido, `cursor:not-allowed`).

**Markup final — linha SEM "x" (convocação, ex.: vaga 101039):**

```html
<td>
  <div class="vagas-actions-cell">
    <!-- 1) Lupa -->
    <a href="visualizar-vaga.html?vaga=101039" class="btn-icon-action"
       title="Visualizar a vaga" aria-label="Visualizar a vaga">
      <i class="fa-solid fa-magnifying-glass"></i>
    </a>
    <!-- 2) Boneco: convocação (navegável) -->
    <a href="convocacao.html?vaga=101039" class="btn-icon-action"
       title="Essa vaga está disponível para convocação"
       aria-label="Essa vaga está disponível para convocação">
      <i class="fa-solid fa-user"></i>
    </a>
    <!-- 3) Gestão -->
    <a href="gestao-encaminhamentos.html?vaga=101039" class="btn-icon-action"
       title="Gestão de encaminhamentos" aria-label="Gestão de encaminhamentos">
      <i class="fa-solid fa-people-arrows"></i>
    </a>
  </div>
</td>
```

**Markup final — linha COM "x" (interesse, DESABILITADO, ex.: vaga 101040):**

```html
<td>
  <div class="vagas-actions-cell">
    <!-- 1) Lupa -->
    <a href="visualizar-vaga.html?vaga=101040" class="btn-icon-action"
       title="Visualizar a vaga" aria-label="Visualizar a vaga">
      <i class="fa-solid fa-magnifying-glass"></i>
    </a>
    <!-- 2) Boneco: interesse (DESABILITADO, sem navegação) -->
    <span class="btn-icon-action btn-icon-action--disabled" role="img"
          aria-disabled="true"
          title="Essa vaga está disponível para manifestação de interesse"
          aria-label="Essa vaga está disponível para manifestação de interesse">
      <i class="fa-solid fa-user-slash" aria-hidden="true"></i>
    </span>
    <!-- 3) Gestão -->
    <a href="gestao-encaminhamentos.html?vaga=101040" class="btn-icon-action"
       title="Gestão de encaminhamentos" aria-label="Gestão de encaminhamentos">
      <i class="fa-solid fa-people-arrows"></i>
    </a>
  </div>
</td>
```

#### 1d. Botão "Simular Trabalhadores"

No rodapé (`.vagas-footer-actions`), alterar o destino do botão:

- **De:** `onclick="window.location.href='visualizar-vaga.html'"`
- **Para:** `onclick="window.location.href='convocacao.html'"`

### 2. `convocacao.html` (novo)

Estrutura completa (casca padrão do protótipo + conteúdo migrado):

```
<head>
  style.css + Font Awesome CDN
<body>
  skip-link (#main-content)
  header.govbr-header
  #sidebar-overlay
  nav.barra-atendimento-topo  (Página inicial do atendimento + Finalizar o atendimento)
  .app-layout
    nav.govbr-sidebar  (mesmo menu das demais páginas)
    main.main-content#main-content
      .page-header  → .page-back-btn (href="lista-vagas.html") + <h1 class="page-title">Convocação</h1>
      .govbr-card   → .vaga-info-row (Código / Título)        ← card de identificação
      <section class="criterios-section"> ...                 ← MIGRADO
      <section class="filtros-section"> #filter-form ...       ← MIGRADO
      <section class="table-section"> #table-trabalhadores ... ← MIGRADO (com botões de convocação)
  footer.barra-atendimento  (rodapé)
  #modal-flexibilizar        ← MIGRADO
  #modal-legenda             ← MIGRADO
  #modal-filtros-avancados   ← MIGRADO
  #modal-finalizar-atendimento (casca padrão)
  <script src="app.js">
  <script> ... filtros avançados (inline) ... </script>       ← MIGRADO
```

Detalhes:

- **Cabeçalho da página:**
  ```html
  <div class="page-header">
    <a href="lista-vagas.html" class="page-back-btn" aria-label="Voltar à lista de vagas">
      <i class="fa-solid fa-arrow-left"></i>
    </a>
    <h1 class="page-title">Convocação</h1>
  </div>
  ```
- **Card de identificação da vaga** (mesmo padrão de `visualizar-vaga.html`):
  ```html
  <div class="govbr-card">
    <div class="vaga-info-row">
      <div class="vaga-field">
        <span class="vaga-field-label">Código</span>
        <span class="vaga-field-value">2525-05</span>
      </div>
      <div class="vaga-field">
        <span class="vaga-field-label">Título</span>
        <span class="vaga-field-value">Administrador de fundos e carteiras de investimento</span>
      </div>
    </div>
  </div>
  ```
- **Metade inferior migrada integralmente** — a **mesma marcação** hoje existente em `visualizar-vaga.html`:
  - `<section class="criterios-section">` com o botão `#btn-flexibilizar` (`data-modal-target="modal-flexibilizar"`).
  - `<section class="filtros-section">` com `#filter-form`, os campos `#filter-id`/`#filter-condicao`/`#filter-municipio`, o link `#link-mais-filtros` (`data-modal-target="modal-filtros-avancados"`) e o botão `[data-filter-btn]`.
  - `<section class="table-section">` com o botão "Legenda" (`data-modal-target="modal-legenda"`), a tabela `#table-trabalhadores` (com `[data-select-all]`, `[data-row-checkbox]`, as 4 linhas de trabalhadores e a coluna "Ações"), a paginação `#pagination-trabalhadores` e o `.table-footer` com os botões `[data-convocar-email]` e `[data-convocar-ctps]`.
- **Modais migrados:** `#modal-flexibilizar`, `#modal-legenda`, `#modal-filtros-avancados` (marcação idêntica à de `visualizar-vaga.html`).
- **`<script>` inline migrado:** o bloco `DOMContentLoaded` que trata o formulário `#form-filtros-avancados` (funções `coletarFiltros`, `renderizarTags`, botão `#btn-limpar-filtros`, badge de contagem em `#link-mais-filtros`). Deve vir **depois** de `<script src="app.js">`.
- **Inicialização automática:** por `#table-trabalhadores` estar presente, `app.js` inicializa `initTableSelection('table-trabalhadores')`, `initPagination`, `initFlexibilizar`, `initConvocar`, `initVerMais`, `initModals` e `initFilters` sem qualquer alteração no arquivo (ver "Decisão-chave" na Visão Geral).

> Nota: a seção migrada contém o link "Ver mais" (`#btn-ver-mais`) e o bloco `#soft-skills-extra`? **Não** — esses pertencem à seção de Soft Skills, que faz parte da **metade superior** (accordion) e **permanece** em `visualizar-vaga.html`. `initVerMais` roda em `convocacao.html` mas retorna cedo (`if (!btn) return;`) por não encontrar `#btn-ver-mais` ali. Sem efeito colateral.

### 3. `visualizar-vaga.html` (após a migração)

Fica **apenas** com a metade superior. Alterações:

- **Manter:** `head`, `skip-link`, `header.govbr-header`, `#sidebar-overlay`, `nav.barra-atendimento-topo`, `nav.govbr-sidebar`, `.page-header` com `.page-back-btn` (href `lista-vagas.html`) e `<h1>Informações da vaga</h1>`, o `.govbr-card` (Código/Título), o `.govbr-accordion#accordion-detalhes` completo ("Exibir detalhes" com todas as seções), `footer.barra-atendimento`, `#modal-finalizar-atendimento` e `<script src="app.js">`.
- **Remover:**
  - `<section class="criterios-section">` (Critérios flexíveis).
  - `<section class="filtros-section">` (Filtros / `#filter-form` / link "Mais filtros").
  - `<section class="table-section">` de Trabalhadores (`#table-trabalhadores`, paginação e botões `[data-convocar-email]`/`[data-convocar-ctps]`).
  - Modais `#modal-flexibilizar`, `#modal-legenda`, `#modal-filtros-avancados`.
  - O `<script>` inline dos filtros avançados (bloco `#form-filtros-avancados`).

> O link "Mais filtros" e todos os botões relacionados (Legenda, Flexibilizar, Convocar) saem junto com suas seções/modais. Sem `#table-trabalhadores`, o bloco condicional de `app.js` não roda; sem `#form-filtros-avancados`, o script inline seria inócuo — por isso é removido para não deixar código morto.

## Modelos de Dados

Protótipo estático: não há modelo de dados persistido. Os "dados" são valores fixos embutidos no HTML.

### Distribuição de status por identificador de vaga (10 linhas de `#table-vagas`)

Este é o **oráculo** que decide o ramo do boneco em cada linha:

| # | Identificador | Ramo do boneco | Ícone | Boneco navega para |
|---|---|---|---|---|
| 1 | 101040 | Interesse | `fa-user-slash` | — (desabilitado) |
| 2 | 101039 | Convocação | `fa-user` | `convocacao.html?vaga=101039` |
| 3 | 101002 | Interesse | `fa-user-slash` | — (desabilitado) |
| 4 | 101001 | Convocação | `fa-user` | `convocacao.html?vaga=101001` |
| 5 | 101000 | Interesse | `fa-user-slash` | — (desabilitado) |
| 6 | 100999 | Convocação | `fa-user` | `convocacao.html?vaga=100999` |
| 7 | 100922 | Interesse | `fa-user-slash` | — (desabilitado) |
| 8 | 100920 | Convocação | `fa-user` | `convocacao.html?vaga=100920` |
| 9 | 100522 | Interesse | `fa-user-slash` | — (desabilitado) |
| 10 | 100319 | Convocação | `fa-user` | `convocacao.html?vaga=100319` |

- **Convocação (sem "x"):** `{ 101039, 101001, 100999, 100920, 100319 }`
- **Interesse (com "x"):** `{ 101040, 101002, 101000, 100922, 100522 }`

### Mapeamento de estado → destino (por linha)

| Ação | Elemento | `href` (ou comportamento) |
|---|---|---|
| Lupa | `<a class="btn-icon-action">` | `visualizar-vaga.html?vaga=<id>` |
| Boneco/convocação | `<a class="btn-icon-action">` | `convocacao.html?vaga=<id>` |
| Boneco/interesse | `<span class="btn-icon-action btn-icon-action--disabled">` | sem `href`, `aria-disabled="true"` |
| Gestão | `<a class="btn-icon-action">` | `gestao-encaminhamentos.html?vaga=<id>` |

O `<id>` usado nos três `href` navegáveis de uma mesma linha é **sempre o identificador daquela linha** (2ª coluna).

## Tratamento de Erros

Sendo um protótipo estático, o "tratamento de erros" resume-se a robustez de front-end:

- **Ação desabilitada (boneco de interesse):** garantido por construção — elemento `<span>` sem `href`, `aria-disabled="true"` e `pointer-events:none`. Não há clique navegável, não há tab-stop de link. Nenhuma navegação é possível.
- **Parâmetro `?vaga=XXXX` ausente/ inválido em `convocacao.html`:** a página **não** consome o parâmetro para renderizar dados; abrir sem parâmetro (ex.: via botão "Simular Trabalhadores") ou com valor arbitrário não causa erro. O card de identificação exibe valores estáticos de exemplo.
- **Ausência de elementos em `app.js`:** todas as `init*` do fluxo de trabalhadores fazem *guard clauses* (`if (!el) return;`). Assim, `visualizar-vaga.html` (sem `#table-trabalhadores`) não gera exceções.
- **Links quebrados:** todos os destinos (`visualizar-vaga.html`, `convocacao.html`, `gestao-encaminhamentos.html`, `lista-vagas.html`, `fimAtendimento.html`) devem existir no diretório do protótipo. `convocacao.html` é criada nesta feature; os demais já existem.

## Estratégia de Testes

Por ser protótipo estático de UI, a validação é predominantemente por **inspeção/visual** e verificação estrutural do DOM, complementada por **um teste de propriedade** sobre a tabela de vagas.

### Testes por inspeção / visual (exemplos e smoke)

- **`lista-vagas.html`:** confirmar visualmente que a coluna inicial de status sumiu, que a 1ª coluna "Identificação" tem largura normal (regra 40px removida), que cada linha mostra 3 ícones (lupa, boneco, gestão) e que o boneco de interesse aparece esmaecido e não clicável; confirmar tooltip "Visualizar a vaga" na lupa; confirmar que "Simular Trabalhadores" abre `convocacao.html`.
- **`convocacao.html`:** abrir com e sem `?vaga=`; confirmar título "Convocação", card Código/Título, botão Voltar → `lista-vagas.html`; confirmar que seleção de linhas, botões de convocação (toasts), modais Flexibilizar/Legenda/Filtros avançados e o botão "Filtrar" funcionam (validação de **integração** do `app.js` + script inline, 1 execução).
- **`visualizar-vaga.html`:** confirmar presença de card + accordion e ausência de Critérios/Filtros/Trabalhadores/botões de convocação e dos 3 modais migrados; confirmar que `#modal-finalizar-atendimento` e o botão Voltar continuam.
- **Integridade de links:** percorrer os `href`/`onclick` das páginas alteradas e confirmar que os alvos existem.

### Teste de propriedade

- Executável parseando o HTML estático de `lista-vagas.html` (ex.: com `jsdom` + fast-check, ou verificação iterativa sobre o DOM). Mínimo de 100 iterações quando aplicável (o gerador escolhe aleatoriamente entre as 10 linhas e/ou entre os conjuntos de convocação/interesse).
- Configuração de tag: **Feature: convocacao-lista-vagas, Property 1**.

## Correctness Properties

*Uma propriedade é uma característica ou comportamento que deve valer para todas as execuções válidas do sistema — essencialmente uma afirmação formal sobre o que o sistema deve fazer. Propriedades servem de ponte entre a especificação legível por humanos e garantias de correção verificáveis por máquina.*

### Property 1: Estrutura da coluna de ações e destinos da tabela de vagas

*Para toda* linha `r` do corpo de `#table-vagas` em `lista-vagas.html`, seja `id` o identificador exibido na coluna "Identificação" de `r`. Então **todas** as condições a seguir valem:

1. A tabela possui exatamente **7 colunas** (cabeçalhos `Identificação`, `Data de cadastro`, `Cargo`, `Quant.`, `Status`, `Contratação`, `Ações`) e `r` **não** contém nenhuma célula `td.vaga-status-cell` (ou seja, a coluna de status foi removida).
2. A célula de ações (`.vagas-actions-cell`) de `r` contém **exatamente 3** elementos de ação, na ordem **lupa → boneco → gestão** (`fa-magnifying-glass`, depois `fa-user`/`fa-user-slash`, depois `fa-people-arrows`).
3. A **lupa** é `<a class="btn-icon-action">` com `href = "visualizar-vaga.html?vaga=" + id` e `title = aria-label = "Visualizar a vaga"`.
4. A **gestão** é `<a class="btn-icon-action">` com `href = "gestao-encaminhamentos.html?vaga=" + id`.
5. O **boneco** satisfaz exatamente um dos ramos, usando o **mesmo `id`** da linha:
   - **(a) Convocação** (quando `id ∈ {101039, 101001, 100999, 100920, 100319}`): é `<a class="btn-icon-action">` navegável com `href = "convocacao.html?vaga=" + id`, ícone `fa-user`, e `title = aria-label = "Essa vaga está disponível para convocação"`.
   - **(b) Interesse** (quando `id ∈ {101040, 101002, 101000, 100922, 100522}`): é **desabilitado** — elemento **sem `href` navegável**, com `aria-disabled="true"`, ícone `fa-user-slash`, e `title = aria-label = "Essa vaga está disponível para manifestação de interesse"`.

**Validates: Requirements 1.1, 1.2, 1.3, 2.2, 2.3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.9**
