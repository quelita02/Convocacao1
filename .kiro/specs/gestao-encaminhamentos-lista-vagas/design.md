# Documento de Design

## Visão Geral

Esta funcionalidade tem dois focos:

1. **Adaptar `lista-vagas.html`**: reposicionar o ícone de boneco (hoje ação "Encaminhar trabalhador") para uma nova **primeira coluna** da `.govbr-table#table-vagas`, transformando-o em um **indicador visual de status não clicável**; ajustar o tooltip do ícone da lupa; e adicionar um novo ícone de ação "Gestão de encaminhamentos" na célula de ações.
2. **Criar `gestao-encaminhamentos.html`**: nova página que reutiliza a estrutura padrão do projeto (header GOV.BR, barras de atendimento, `app-layout` com sidebar e `main-content`, rodapé e modal de finalização) para exibir a identificação do empregador, os dados da vaga (em accordions) e a tabela "Encaminhamentos Pendentes de retorno".

Por se tratar de um protótipo estático (HTML/CSS/JS puros), não há integração com backend: todas as ações operacionais (Imprimir, Registrar resultado, Salvar XLS, Encaminhamentos Pendentes de retorno) apenas exibem uma mensagem via `window.showToast`, e o Cancelar navega por `href`/`location`.

O design segue estritamente os padrões reais já presentes no código:

- **Ícones de ação**: `.btn-icon-action` (quadrado, azul) e `.btn-icon-action--circle` (círculo, contorno) — `style.css`, seção "BOTÕES DE AÇÃO POR LINHA".
- **Accordions**: markup `.govbr-accordion` > `.accordion-header` (`open`) + `.accordion-icon` + `.accordion-body` (`expanded`) > `.accordion-content`; a lógica em `app.js` (`initAccordions`/`toggleAccordion`) liga o clique em `.accordion-header` para alternar as classes `open`/`expanded`. Observado em `detalhes-vaga.html`.
- **Detalhes em grade**: `.details-grid` / `.details-grid-2col`, `.detail-field`, `.detail-label`, `.detail-value`.
- **Toasts**: `window.showToast(mensagem, tipo)` com tipos `success | warning | danger | info` (`app.js`).
- **Scripts inline por página**: `lista-vagas.html` já usa um `<script>` inline para o filtro. Seguiremos o mesmo padrão para o comportamento da nova página, sem poluir `app.js`.

## Arquitetura

```
lista-vagas.html ──(lupa: index.html?vaga=XXXX)──────────▶ index.html
        │
        └──(ícone gestão: gestao-encaminhamentos.html?vaga=XXXX)──▶ gestao-encaminhamentos.html
                                                                          │
                                                          (Cancelar)──────┴──▶ lista-vagas.html
```

- **Camada de apresentação**: HTML estático + `style.css` (tokens e classes GOV.BR).
- **Camada de comportamento**: `app.js` (compartilhado: accordions, modais, toasts) + `<script>` inline específico da página (ações do protótipo).
- **Sem estado persistente**: os dados são fixos no markup (valores de exemplo dos requisitos).

## Componentes e Interfaces

### 1. Alterações em `lista-vagas.html`

#### 1.1 Ícone da lupa (Requisito 1)

Mantém-se a ação, o `href` (`index.html?vaga=XXXX`) e a classe `fa-magnifying-glass`. Alteram-se apenas `title` e `aria-label` para **"Visualizar a vaga e encaminhar trabalhador"** (removendo o sufixo por-linha que existia em algumas linhas, para uniformizar o rótulo exigido).

Antes:
```html
<a href="index.html?vaga=101040" class="btn-icon-action" title="Simular trabalhadores" aria-label="Simular trabalhadores vaga 101040">
  <i class="fa-solid fa-magnifying-glass"></i>
</a>
```
Depois:
```html
<a href="index.html?vaga=101040" class="btn-icon-action"
   title="Visualizar a vaga e encaminhar trabalhador"
   aria-label="Visualizar a vaga e encaminhar trabalhador">
  <i class="fa-solid fa-magnifying-glass"></i>
</a>
```

#### 1.2 Nova primeira coluna: Indicador de status (Requisito 2)

- **Cabeçalho**: um novo `<th>` **vazio** e estreito é inserido como **primeira** coluna do `thead`.
- **Corpo**: cada `<tr>` recebe uma **primeira `<td>`** contendo o `Indicador_De_Status`.
- **Indicador**: elemento **não clicável** — um `<span>` (sem `href`), com `role="img"` e `title`/`aria-label`. **O boneco deixa de existir na célula de ações.**

**Abordagem escolhida para "com X" vs "sem X" (Font Awesome disponível — FA 6.4.2):**

Para máxima simplicidade e fidelidade ao Font Awesome já carregado, usa-se um único glifo por estado, sem overlay:

- **Boneco COM "X"** → `fa-solid fa-user-slash` (boneco com traço/barra, que representa a marcação "X") → tooltip **"Essa vaga está disponível para manifestação de interesse"**.
- **Boneco SEM "X"** → `fa-solid fa-user` (boneco simples) → tooltip **"Essa vaga está disponível para convocação"**.

Essa escolha evita composição de camadas (overlay/`fa-stack`) e mantém o markup limpo. Uma nova classe `.vaga-status-icon` é proposta apenas para padronizar tamanho/cor/centralização do indicador (ver CSS em Modelos de Dados / seção CSS).

**Distribuição entre as 10 linhas** (atende ao Requisito 2.6 — ao menos uma de cada; distribuição misturada, alternando por legibilidade):

| Linha | Identificação | Estado do indicador | Ícone            | Tooltip                                                  |
|-------|---------------|---------------------|------------------|----------------------------------------------------------|
| 1     | 101040        | COM X               | `fa-user-slash`  | Essa vaga está disponível para manifestação de interesse |
| 2     | 101039        | SEM X               | `fa-user`        | Essa vaga está disponível para convocação                |
| 3     | 101002        | COM X               | `fa-user-slash`  | Essa vaga está disponível para manifestação de interesse |
| 4     | 101001        | SEM X               | `fa-user`        | Essa vaga está disponível para convocação                |
| 5     | 101000        | COM X               | `fa-user-slash`  | Essa vaga está disponível para manifestação de interesse |
| 6     | 100999        | SEM X               | `fa-user`        | Essa vaga está disponível para convocação                |
| 7     | 100922        | COM X               | `fa-user-slash`  | Essa vaga está disponível para manifestação de interesse |
| 8     | 100920        | SEM X               | `fa-user`        | Essa vaga está disponível para convocação                |
| 9     | 100522        | COM X               | `fa-user-slash`  | Essa vaga está disponível para manifestação de interesse |
| 10    | 100319        | SEM X               | `fa-user`        | Essa vaga está disponível para convocação                |

Markup do indicador (variante COM X):
```html
<td class="vaga-status-cell">
  <span class="vaga-status-icon vaga-status-icon--interesse" role="img"
        title="Essa vaga está disponível para manifestação de interesse"
        aria-label="Essa vaga está disponível para manifestação de interesse">
    <i class="fa-solid fa-user-slash" aria-hidden="true"></i>
  </span>
</td>
```
Markup do indicador (variante SEM X):
```html
<td class="vaga-status-cell">
  <span class="vaga-status-icon vaga-status-icon--convocacao" role="img"
        title="Essa vaga está disponível para convocação"
        aria-label="Essa vaga está disponível para convocação">
    <i class="fa-solid fa-user" aria-hidden="true"></i>
  </span>
</td>
```

#### 1.3 Novo ícone de ação: Gestão de encaminhamentos (Requisito 3)

Na `.vagas-actions-cell`, o boneco antigo (`fa-user-plus`) é **substituído** pelo ícone de gestão. Reutiliza-se `.btn-icon-action` (mesmo estilo da lupa):

```html
<a class="btn-icon-action" href="gestao-encaminhamentos.html?vaga=101040"
   title="Gestão de encaminhamentos" aria-label="Gestão de encaminhamentos">
  <i class="fa-solid fa-people-arrows"></i>
</a>
```

#### 1.4 Markup final de exemplo de uma linha completa (linha 1 — 101040, COM X)

```html
<tr>
  <!-- 1ª coluna: indicador de status (não clicável) -->
  <td class="vaga-status-cell">
    <span class="vaga-status-icon vaga-status-icon--interesse" role="img"
          title="Essa vaga está disponível para manifestação de interesse"
          aria-label="Essa vaga está disponível para manifestação de interesse">
      <i class="fa-solid fa-user-slash" aria-hidden="true"></i>
    </span>
  </td>
  <td>101040</td>
  <td>19/08/2026</td>
  <td>Agente Administrativo</td>
  <td style="text-align:center;">10</td>
  <td><span class="badge badge-aberta">Aberta</span></td>
  <td>Permanente</td>
  <td>
    <div class="vagas-actions-cell">
      <a href="index.html?vaga=101040" class="btn-icon-action"
         title="Visualizar a vaga e encaminhar trabalhador"
         aria-label="Visualizar a vaga e encaminhar trabalhador">
        <i class="fa-solid fa-magnifying-glass"></i>
      </a>
      <a class="btn-icon-action" href="gestao-encaminhamentos.html?vaga=101040"
         title="Gestão de encaminhamentos" aria-label="Gestão de encaminhamentos">
        <i class="fa-solid fa-people-arrows"></i>
      </a>
    </div>
  </td>
</tr>
```

> Observação: o novo `<th>` vazio deve ser adicionado ao `thead` como primeira coluna, de modo que a contagem de colunas do cabeçalho (8) coincida com a do corpo.

#### 1.5 CSS mínimo (adicionar ao bloco `<style>` de `lista-vagas.html`)

Reutiliza-se `.btn-icon-action` para a ação de gestão (nenhuma classe nova para ação). Para o indicador, propõe-se a nova classe `.vaga-status-icon`, baseada em tokens:

```css
/* Primeira coluna estreita para o indicador de status */
#table-vagas thead th:first-child,
#table-vagas tbody td:first-child { width: 40px; text-align: center; }

/* Indicador de status (não clicável) */
.vaga-status-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  font-size: var(--font-size-scale-base);
  color: var(--color-text-secondary);
}
.vaga-status-icon--interesse { color: var(--color-primary); }
.vaga-status-icon--convocacao { color: var(--color-text-secondary); }
```

> As classes modificadoras de cor são opcionais (apenas para diferenciar visualmente os dois estados); o valor semântico está no `title`/`aria-label`. Todos os valores usam tokens já definidos em `style.css`.

### 2. Nova página `gestao-encaminhamentos.html`

#### 2.1 Estrutura padrão (Requisito 4)

Replica a "casca" de `lista-vagas.html`:

- `<head>`: `<link rel="stylesheet" href="style.css">`, Font Awesome via CDN (`.../font-awesome/6.4.2/css/all.min.css`), e um `<style>` local apenas se necessário.
- `.skip-link`, `header.govbr-header`, `.sidebar-overlay`.
- `nav.barra-atendimento-topo` (Página inicial do atendimento → `lista-vagas.html`; Finalizar o atendimento → abre `modal-finalizar-atendimento`).
- `.app-layout` > `nav.govbr-sidebar` (mesmo menu) + `main.main-content#main-content`.
- `footer.barra-atendimento` (duração do atendimento).
- Reutilizar o modal `#modal-finalizar-atendimento` (consistência com as demais telas).
- `<script src="app.js"></script>` seguido do `<script>` inline da página.
- Título da página (`h1.page-title` ou título de seção): **"Identificação do empregador que oferece a vaga"**.

#### 2.2 Accordion 1 — Identificação do empregador (Requisito 5)

Usa o padrão real de accordion (inicia **aberto**). Os campos usam `.details-grid` / `.detail-field`.

```html
<div class="govbr-accordion" id="accordion-empregador" role="region" aria-label="Identificação do empregador">
  <button class="accordion-header open" aria-expanded="true"
          aria-controls="accordion-body-empregador" id="accordion-btn-empregador">
    <span class="accordion-title">Identificação do empregador</span>
    <i class="fa-solid fa-chevron-down accordion-icon" aria-hidden="true"></i>
  </button>
  <div class="accordion-body expanded" id="accordion-body-empregador"
       role="region" aria-labelledby="accordion-btn-empregador">
    <div class="accordion-content">
      <div class="details-grid">
        <div class="detail-field"><span class="detail-label">Tipo de identificação</span><span class="detail-value">CNPJ</span></div>
        <div class="detail-field"><span class="detail-label">Número de identificação</span><span class="detail-value">08.811.226/0019-03</span></div>
        <div class="detail-field"><span class="detail-label">Nome de Fantasia</span><span class="detail-value">CAFE SAO BRAZ</span></div>
        <div class="detail-field"><span class="detail-label">Contato</span><span class="detail-value">Nome</span></div>
        <div class="detail-field"><span class="detail-label">Telefone</span><span class="detail-value">(27) 99999-1234</span></div>
      </div>
    </div>
  </div>
</div>
```

#### 2.3 Accordion 2 — Dados da vaga (Requisito 6)

O título do accordion é **"Dados da vaga"**. O `<th>`/rótulo da ação de recolher exibe **"Ocultar"** quando aberto. Como o `toggleAccordion` do projeto alterna apenas as classes (não troca o texto), a ação "Ocultar" é representada pelo próprio header clicável com um rótulo textual "Ocultar" ao lado do chevron; o clique recolhe/expande via `app.js`. Inicia **aberto** (para que "Ocultar" faça sentido).

```html
<div class="govbr-accordion" id="accordion-dados-vaga" role="region" aria-label="Dados da vaga">
  <button class="accordion-header open" aria-expanded="true"
          aria-controls="accordion-body-dados-vaga" id="accordion-btn-dados-vaga">
    <span class="accordion-title">Dados da vaga</span>
    <span class="accordion-action" aria-hidden="true">Ocultar</span>
    <i class="fa-solid fa-chevron-down accordion-icon" aria-hidden="true"></i>
  </button>
  <div class="accordion-body expanded" id="accordion-body-dados-vaga"
       role="region" aria-labelledby="accordion-btn-dados-vaga">
    <div class="accordion-content">
      <div class="details-grid">
        <div class="detail-field"><span class="detail-label">Número de identificação</span><span class="detail-value">99920</span></div>
        <div class="detail-field"><span class="detail-label">Data de cadastro</span><span class="detail-value">04/12/2025</span></div>
        <div class="detail-field"><span class="detail-label">Tipo de intermediação</span><span class="detail-value">Por ocupação</span></div>
        <div class="detail-field"><span class="detail-label">Ocupação</span><span class="detail-value">5134-35 - Atendente de lanchonete</span></div>
        <div class="detail-field"><span class="detail-label">Contratação</span><span class="detail-value">Permanente</span></div>
        <div class="detail-field"><span class="detail-label">Encerrada?</span><span class="detail-value">Sim</span></div>
        <div class="detail-field"><span class="detail-label">Status da vaga</span><span class="detail-value">Prazo de validade expirado</span></div>
        <div class="detail-field"><span class="detail-label">Direcionamento</span><span class="detail-value">Indiferente</span></div>
        <div class="detail-field"><span class="detail-label">Iniciativa</span><span class="detail-value">Empregador</span></div>
        <div class="detail-field"><span class="detail-label">Data final prevista para retorno do encaminhamento</span><span class="detail-value">05/12/2025</span></div>
        <div class="detail-field"><span class="detail-label">Quantidade de vagas oferecidas</span><span class="detail-value">3</span></div>
        <div class="detail-field"><span class="detail-label">Reposição</span><span class="detail-value">3</span></div>
        <div class="detail-field"><span class="detail-label">Aumento de quadro</span><span class="detail-value">0</span></div>
        <div class="detail-field"><span class="detail-label">Vagas canceladas</span><span class="detail-value">0</span></div>
      </div>
    </div>
  </div>
</div>
```

> A classe `.accordion-action` (opcional) é apenas um rótulo textual "Ocultar"; se preferir não criar estilo, pode ser um `<span>` sem classe. O recolhimento efetivo é feito pelo `toggleAccordion` já existente.

#### 2.4 Tabela "Encaminhamentos Pendentes de retorno" (Requisito 7)

Usa `.table-section` + `.table-header-row`/`.table-title` + `.govbr-table` (mesmos padrões da lista de vagas). Colunas: 2 indicadores por trabalhador, PIS/PASEP/NIS/NIT, Nome do trabalhador, Data, Ações.

**Ícones definidos:**

- Indicador "Trabalhador não monitorado pelo SD" → `fa-solid fa-eye-slash` (não clicável, `<span>` com `role="img"` + `title`/`aria-label`).
- Indicador "Trabalhador sem curso concluído no PRONATEC" → `fa-solid fa-graduation-cap` (não clicável, `<span>` com `role="img"` + `title`/`aria-label`).
- Ação **Imprimir** → `fa-solid fa-print` (`.btn-icon-action`).
- Ação **Registrar o resultado do encaminhamento** → `fa-solid fa-clipboard-check` (`.btn-icon-action`).

```html
<section class="table-section" aria-label="Encaminhamentos pendentes de retorno">
  <div class="table-header-row">
    <h2 class="table-title">Encaminhamentos Pendentes de retorno</h2>
  </div>
  <div class="govbr-table-wrapper">
    <table class="govbr-table" id="table-encaminhamentos" aria-label="Encaminhamentos pendentes de retorno">
      <thead>
        <tr>
          <th scope="col" style="width:40px;text-align:center;">SD</th>
          <th scope="col" style="width:40px;text-align:center;">PRONATEC</th>
          <th scope="col">PIS/PASEP/NIS/NIT</th>
          <th scope="col">Nome do trabalhador</th>
          <th scope="col">Data</th>
          <th scope="col" style="text-align:center;">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align:center;">
            <span class="vaga-status-icon" role="img"
                  title="Trabalhador não monitorado pelo SD"
                  aria-label="Trabalhador não monitorado pelo SD">
              <i class="fa-solid fa-eye-slash" aria-hidden="true"></i>
            </span>
          </td>
          <td style="text-align:center;">
            <span class="vaga-status-icon" role="img"
                  title="Trabalhador sem curso concluído no PRONATEC"
                  aria-label="Trabalhador sem curso concluído no PRONATEC">
              <i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>
            </span>
          </td>
          <td>190.18588.38-8</td>
          <td>Cicero Joao da Silva</td>
          <td>04/12/2025</td>
          <td>
            <div class="vagas-actions-cell">
              <button type="button" class="btn-icon-action" data-acao="imprimir"
                      title="Imprimir" aria-label="Imprimir">
                <i class="fa-solid fa-print"></i>
              </button>
              <button type="button" class="btn-icon-action" data-acao="registrar"
                      title="Registrar o resultado do encaminhamento"
                      aria-label="Registrar o resultado do encaminhamento">
                <i class="fa-solid fa-clipboard-check"></i>
              </button>
            </div>
          </td>
        </tr>
        <!-- Linha 2: 214.63337.84-3 / Fulano Dtgcpqv Raxduichf / 04/12/2025 -->
        <!-- Linha 3: 567.84565.75-4 / Jacy Afonso de Melo / 04/12/2025 -->
      </tbody>
    </table>
  </div>
</section>
```

> Os cabeçalhos das colunas de indicadores usam rótulos curtos ("SD", "PRONATEC") com o texto completo do requisito repassado ao `title`/`aria-label` do indicador de cada linha, garantindo a semântica exigida pelo Requisito 7.2.

#### 2.5 Botão "Salvar XLS" e rodapé de ações (Requisito 7.7, 7.8)

```html
<div class="vagas-footer-actions">
  <button class="govbr-btn govbr-btn-secondary" type="button" id="btn-salvar-xls">
    <i class="fa-solid fa-file-excel"></i> Salvar XLS
  </button>
  <button class="govbr-btn govbr-btn-primary" type="button" id="btn-encaminhamentos-pendentes">
    Encaminhamentos Pendentes de retorno
  </button>
  <button class="govbr-btn govbr-btn-secondary" type="button" id="btn-cancelar"
          onclick="window.location.href='lista-vagas.html'">
    Cancelar
  </button>
</div>
```

#### 2.6 Comportamento do protótipo (Requisito 8)

Segue o padrão de `lista-vagas.html`: **script inline na própria página** (não em `app.js`), reutilizando `window.showToast` e `window.location`.

```html
<script src="app.js"></script>
<script>
  // Ações de linha (Imprimir / Registrar) — delegação de eventos
  document.getElementById('table-encaminhamentos')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-acao]');
    if (!btn) return;
    if (btn.dataset.acao === 'imprimir') {
      window.showToast && showToast('Documento enviado para impressão.', 'info');
    } else if (btn.dataset.acao === 'registrar') {
      window.showToast && showToast('Registro do resultado do encaminhamento iniciado.', 'success');
    }
  });

  document.getElementById('btn-salvar-xls')?.addEventListener('click', () => {
    window.showToast && showToast('Arquivo XLS gerado com sucesso.', 'success');
  });

  document.getElementById('btn-encaminhamentos-pendentes')?.addEventListener('click', () => {
    window.showToast && showToast('Lista de encaminhamentos pendentes atualizada.', 'info');
  });
  // "Cancelar" navega via onclick inline no markup (window.location.href='lista-vagas.html')
</script>
```

> Os accordions e o modal de finalização são inicializados automaticamente por `app.js` (`initAccordions`, `initModals`) ao carregar a página, pois usam o mesmo markup (`.accordion-header`, `data-modal-target`/`data-modal-close`).

#### 2.7 Estilos locais

Nenhum estilo local é obrigatório — todas as classes já existem em `style.css`. Caso o rótulo "Ocultar" (`.accordion-action`) precise de espaçamento, adiciona-se um pequeno bloco `<style>` local baseado em tokens:

```css
.accordion-action {
  margin-left: auto; margin-right: var(--spacing-scale-2);
  font-size: var(--font-size-scale-down-01);
  color: var(--color-primary);
}
```

## Modelos de Dados

Dados estáticos embutidos no markup (protótipo, sem backend).

### Tabela_De_Vagas (10 linhas) — `lista-vagas.html`

| Identificação | Indicador (com/sem X) | href lupa                 | href gestão                              |
|---------------|-----------------------|---------------------------|------------------------------------------|
| 101040        | COM X (interesse)     | index.html?vaga=101040    | gestao-encaminhamentos.html?vaga=101040  |
| 101039        | SEM X (convocação)    | index.html?vaga=101039    | gestao-encaminhamentos.html?vaga=101039  |
| 101002        | COM X (interesse)     | index.html?vaga=101002    | gestao-encaminhamentos.html?vaga=101002  |
| 101001        | SEM X (convocação)    | index.html?vaga=101001    | gestao-encaminhamentos.html?vaga=101001  |
| 101000        | COM X (interesse)     | index.html?vaga=101000    | gestao-encaminhamentos.html?vaga=101000  |
| 100999        | SEM X (convocação)    | index.html?vaga=100999    | gestao-encaminhamentos.html?vaga=100999  |
| 100922        | COM X (interesse)     | index.html?vaga=100922    | gestao-encaminhamentos.html?vaga=100922  |
| 100920        | SEM X (convocação)    | index.html?vaga=100920    | gestao-encaminhamentos.html?vaga=100920  |
| 100522        | COM X (interesse)     | index.html?vaga=100522    | gestao-encaminhamentos.html?vaga=100522  |
| 100319        | SEM X (convocação)    | index.html?vaga=100319    | gestao-encaminhamentos.html?vaga=100319  |

### Identificação do empregador — `gestao-encaminhamentos.html`

| Campo                     | Valor                |
|---------------------------|----------------------|
| Tipo de identificação     | CNPJ                 |
| Número de identificação   | 08.811.226/0019-03   |
| Nome de Fantasia          | CAFE SAO BRAZ        |
| Contato                   | Nome                 |
| Telefone                  | (27) 99999-1234      |

### Dados da vaga — `gestao-encaminhamentos.html`

| Campo                                                | Valor                                |
|------------------------------------------------------|--------------------------------------|
| Número de identificação                              | 99920                                |
| Data de cadastro                                     | 04/12/2025                           |
| Tipo de intermediação                                | Por ocupação                         |
| Ocupação                                             | 5134-35 - Atendente de lanchonete    |
| Contratação                                          | Permanente                           |
| Encerrada?                                           | Sim                                  |
| Status da vaga                                       | Prazo de validade expirado           |
| Direcionamento                                       | Indiferente                          |
| Iniciativa                                           | Empregador                           |
| Data final prevista para retorno do encaminhamento   | 05/12/2025                           |
| Quantidade de vagas oferecidas                       | 3                                    |
| Reposição                                            | 3                                    |
| Aumento de quadro                                    | 0                                    |
| Vagas canceladas                                     | 0                                    |

### Tabela_Encaminhamentos (3 linhas) — `gestao-encaminhamentos.html`

| PIS/PASEP/NIS/NIT | Nome do trabalhador       | Data       | SD (não monitorado) | PRONATEC (sem curso) |
|-------------------|---------------------------|------------|---------------------|----------------------|
| 190.18588.38-8    | Cicero Joao da Silva      | 04/12/2025 | indicador           | indicador            |
| 214.63337.84-3    | Fulano Dtgcpqv Raxduichf  | 04/12/2025 | indicador           | indicador            |
| 567.84565.75-4    | Jacy Afonso de Melo       | 04/12/2025 | indicador           | indicador            |

### Mapeamento de ícones

| Elemento                                   | Ícone Font Awesome        | Clicável? |
|--------------------------------------------|---------------------------|-----------|
| Indicador de vaga — manifestação (com X)   | `fa-user-slash`           | Não       |
| Indicador de vaga — convocação (sem X)     | `fa-user`                 | Não       |
| Lupa (visualizar/encaminhar)               | `fa-magnifying-glass`     | Sim       |
| Gestão de encaminhamentos                  | `fa-people-arrows`        | Sim       |
| Indicador trabalhador não monitorado (SD)  | `fa-eye-slash`            | Não       |
| Indicador sem curso PRONATEC               | `fa-graduation-cap`       | Não       |
| Imprimir                                   | `fa-print`                | Sim       |
| Registrar resultado do encaminhamento      | `fa-clipboard-check`      | Sim       |
| Salvar XLS                                 | `fa-file-excel`           | Sim       |

## Tratamento de Erros

Por ser protótipo estático, não há erros de backend a tratar. As diretrizes de robustez são:

- **Guardas de existência**: os listeners inline usam optional chaining (`?.`) e checam `window.showToast &&` antes de invocar, evitando erros de console caso um elemento não exista.
- **Navegação segura**: links (`href`) e `window.location.href` são as únicas formas de navegação; nenhuma dependência de estado externo.
- **Acessibilidade**: indicadores não clicáveis usam `<span>` com `role="img"` e `title`/`aria-label`; ícones decorativos internos usam `aria-hidden="true"`.
- **Degradação**: se `app.js` não carregar, os accordions permanecem no estado inicial `open`/`expanded` (conteúdo visível), preservando o acesso à informação.

## Estratégia de Testes

Abordagem baseada em **inspeção/verificação visual e de markup** (protótipo estático), complementada por uma verificação universal sobre a Tabela_De_Vagas.

### Verificações de tipo EXAMPLE (inspeção de markup/texto)

- **Lupa** (Req. 1.2–1.4): `title`/`aria-label` iguais a "Visualizar a vaga e encaminhar trabalhador"; classe `fa-magnifying-glass` presente.
- **Cabeçalho da 1ª coluna** (Req. 2.1): primeiro `<th>` vazio e estreito.
- **Existência de ambos os estados** (Req. 2.6): pelo menos uma linha com X e uma sem X.
- **Ícone de gestão** (Req. 3.2–3.3): classe `fa-people-arrows`; `title`/`aria-label` "Gestão de encaminhamentos".
- **Título da página** (Req. 4.4): "Identificação do empregador que oferece a vaga".
- **Accordions** (Req. 5.1–5.6, 6.1, 6.3–6.16): cada par rótulo/valor conforme as tabelas de Modelos de Dados.
- **Recolher "Ocultar"** (Req. 6.2): clicar no header remove `expanded` de `.accordion-body` (comportamento de `app.js`).
- **Tabela de encaminhamentos** (Req. 7.1–7.6): título, colunas e as 3 linhas de exemplo.
- **Botões** (Req. 7.7, 7.8): "Salvar XLS", "Encaminhamentos Pendentes de retorno", "Cancelar".
- **Ações de protótipo** (Req. 8.1–8.4): clique dispara `showToast`.
- **Cancelar** (Req. 8.5): navega para `lista-vagas.html`.

### Verificações de tipo SMOKE (setup da página)

- **Estrutura padrão** (Req. 4.1): presença de `govbr-header`, `barra-atendimento-topo`, `app-layout` (sidebar + `main-content`) e `barra-atendimento`.
- **Tokens de estilo** (Req. 4.2): página referencia `style.css` e usa classes/tokens do projeto.
- **Recursos** (Req. 4.3): `<link>` do Font Awesome (CDN), `style.css` e `<script src="app.js">` presentes.

### Verificação de tipo PROPERTY

A regularidade universal está na consistência das 10 linhas da Tabela_De_Vagas (indicador correto + casamento de `id` nos dois links). Formalizada na seção Correctness Properties (Property 1). Recomenda-se implementá-la como verificação sobre o DOM iterando todos os `<tr>` do `#table-vagas`.

## Correctness Properties

*Uma propriedade é uma característica ou comportamento que deve ser verdadeiro em todas as execuções válidas do sistema — essencialmente, uma afirmação formal sobre o que o sistema deve fazer. As propriedades servem de ponte entre especificações legíveis por humanos e garantias de correção verificáveis por máquina.*

### Property 1: Consistência das linhas da Tabela_De_Vagas

*Para toda* linha (`<tr>`) do corpo de `#table-vagas`, seja `id` o identificador exibido na célula de identificação da linha; então a linha satisfaz simultaneamente:
1. possui exatamente **um** `Indicador_De_Status` na primeira célula, sendo um `<span>` não clicável (sem atributo `href`);
2. o `title` e o `aria-label` do indicador são "Essa vaga está disponível para manifestação de interesse" quando o indicador está no estado "com X" (`fa-user-slash`), ou "Essa vaga está disponível para convocação" quando está no estado "sem X" (`fa-user`);
3. contém um ícone de lupa (`fa-magnifying-glass`) com `href` igual a `index.html?vaga=<id>` e com `title`/`aria-label` "Visualizar a vaga e encaminhar trabalhador";
4. contém um ícone de gestão (`fa-people-arrows`) com `href` igual a `gestao-encaminhamentos.html?vaga=<id>` e com `title`/`aria-label` "Gestão de encaminhamentos",

sendo que o `<id>` usado nos itens 3 e 4 é o **mesmo** identificador da própria linha.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4**
