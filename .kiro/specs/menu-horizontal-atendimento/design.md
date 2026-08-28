# Documento de Design

## Visão Geral

Esta funcionalidade organiza as ações de atendimento das cinco páginas do protótipo IMO GOV.BR em **duas barras fixas horizontais** e cria uma nova página de confirmação de logout (`logout.html`):

- **Barra_Superior_De_Atendimento**: barra fixa (sticky) na parte superior da janela, posicionada **logo abaixo do cabeçalho GOV.BR (`govbr-header`)**, contendo os dois itens de navegação: "Página inicial do atendimento" e "Finalizar o atendimento".
- **Barra_Inferior_De_Atendimento**: barra fixa no rodapé, contendo **apenas** o Indicador_De_Duração ("Duração do atendimento: 00:25").

Ambas permanecem sempre visíveis durante a rolagem do Conteúdo_Principal.

O protótipo é estático (HTML/CSS/JS puro, sem ferramentas de build), em pt-BR, seguindo o Design System GOV.BR v3. Os estilos são centralizados em `style.css` por meio de tokens (CSS custom properties) e os ícones vêm do Font Awesome 6.4.2 já carregado via CDN em cada página.

Decisões de design que guiam a implementação:

- As barras são componentes estruturais (HTML + CSS). O atalho "Página inicial do atendimento" é uma âncora (`<a href>`) e o Indicador_De_Duração é texto estático.
- A ação "Finalizar o atendimento" **não navega diretamente** para `logout.html`; ela **abre um modal de confirmação** (`Modal_De_Confirmacao_Finalizacao`). A abertura reutiliza o mecanismo de modais já existente no projeto — não há API nova. O modal é acionado pelo mesmo padrão dos demais modais (atributo `data-modal-target`, tratado automaticamente por `initModals()` de `app.js`, que chama `openModal(id)`).
- A navegação para `logout.html` acontece apenas quando o Atendente confirma no botão "Sim" do modal. O botão "Não" apenas fecha o modal (padrão `data-modal-close`), mantendo o Atendente na página atual.
- Ambas as barras reaproveitam a classe de item existente (`.barra-atendimento-item`) para o estilo dos links/botões e todos os tokens já disponíveis (`--color-surface`, `--color-primary`, `--color-danger`, `--color-border`, `--spacing-scale-*`, `--font-*`, `--shadow-*`, `--sidebar-width`, `--header-height`). Nenhum valor "mágico" é introduzido. O modal reaproveita integralmente as classes de modal já existentes (`.govbr-modal-overlay`, `.govbr-modal`, `.modal-header`, `.modal-body`, `.modal-footer`, `.modal-close-btn`), sem exigir CSS adicional.
- As duas barras reaproveitam o alinhamento horizontal do layout `app-layout`: deslocamento à esquerda igual a `--sidebar-width`, de modo a ocuparem exatamente a largura da área de conteúdo (e a largura total no mobile, quando `--sidebar-width` passa a `0px`).

## Arquitetura

### Estrutura das páginas (contexto atual e alterações)

Cada página de atendimento segue a mesma espinha dorsal. O cabeçalho `.govbr-header` é **fixo** (`position: fixed; top: 0; z-index: 1000; height: var(--header-height)`); a `.govbr-sidebar` é **fixa** logo abaixo do header (`top: var(--header-height); z-index: 900`); e `.app-layout` já reserva `padding-top: var(--header-height)` para que o conteúdo comece abaixo do header.

```
body
├── a.skip-link
├── header.govbr-header                                    (fixo, topo, z-index 1000)
├── div.sidebar-overlay#sidebar-overlay
├── (nova) nav.barra-atendimento-topo                      ← Barra_Superior (fixa, logo abaixo do header)
├── div.app-layout
│   ├── nav.govbr-sidebar                                  (fixa, top = --header-height)
│   └── main.main-content#main-content
├── footer.barra-atendimento                               ← Barra_Inferior (fixa, rodapé) — só a duração
├── (novo) div.govbr-modal-overlay#modal-finalizar-atendimento   ← modal de confirmação
└── script[src=app.js]
```

A **Barra_Superior_De_Atendimento** é inserida imediatamente **antes** de `.app-layout` (fora dela), de modo a ficar visualmente logo abaixo do `govbr-header`. A **Barra_Inferior_De_Atendimento** é o rodapé fixo já existente (`footer.barra-atendimento`), agora reduzido para conter somente o Indicador_De_Duração. O par barra-inferior + modal permanece inserido antes de `<script src="app.js"></script>`.

### Posicionamento das barras

**Barra_Superior (`.barra-atendimento-topo`)** — fixada logo abaixo do header:

- `position: fixed; top: var(--header-height); left: var(--sidebar-width); right: 0`.
- Altura própria padronizada por um **novo token** `--attendance-topbar-height` (análogo a `--attendance-bar-height`).
- `z-index` coerente (`850`): acima do Conteúdo_Principal, porém abaixo da sidebar (`900`) e do header (`1000`), para não sobrepor o menu lateral (inclusive o drawer mobile).
- No mobile (`max-width: 768px`), `left: 0` (o token `--sidebar-width` já passa a `0px` na regra responsiva existente).

**Barra_Inferior (`.barra-atendimento`)** — fixada no rodapé (comportamento já existente):

- `position: fixed; left: var(--sidebar-width); right: 0; bottom: 0`.
- Altura `--attendance-bar-height`, `z-index: 800`.
- No mobile, `left: 0`.

```
Viewport (desktop)
┌───────────────────────────────────────────────────────────┐
│ govbr-header (fixed, top:0, z-index 1000)                   │
├──────────┬──────────────────────────────────────────────────┤
│          │ barra-atendimento-topo (fixed, top=header, left=240px) │
│ sidebar  ├──────────────────────────────────────────────────┤
│ (fixed,  │ main-content (scroll)                             │
│  z 900)  │  [padding-top reservado p/ a barra superior]      │
│          │  ...conteúdo...                                   │
│          │  [padding-bottom reservado p/ a barra inferior]   │
├──────────┴──────────────────────────────────────────────────┤
│ barra-atendimento (fixed, bottom:0, left=240px) — duração    │
└───────────────────────────────────────────────────────────┘
```

### Reserva de espaço no Conteúdo_Principal

Para que nenhuma das barras fixas sobreponha o conteúdo rolável (`Requisitos 6.3` e `6.4`), o `.main-content` reserva espaçamento nas duas extremidades:

- **Superior** (`Requisito 6.3`): como `.app-layout` já aplica `padding-top: var(--header-height)`, o conteúdo já começa abaixo do header — porém a Barra_Superior é sobreposta a esse topo. Por isso, adiciona-se ao `.main-content` um `padding-top` igual à altura da barra superior mais uma folga: `calc(var(--attendance-topbar-height) + var(--spacing-scale-4))`. Assim, o espaçamento da barra superior é somado **apenas uma vez** (o header já é compensado pelo `app-layout`), sem duplicação.
- **Inferior** (`Requisito 6.4`): mantém o `padding-bottom` já existente, igual à altura da barra inferior mais uma folga: `calc(var(--attendance-bar-height) + var(--spacing-scale-4))`.

As alturas das barras são padronizadas por tokens (`--attendance-topbar-height` e `--attendance-bar-height`) para que os respectivos `padding` do conteúdo e as próprias barras permaneçam sempre consistentes.

## Componentes e Interfaces

### 1. Markup da `Barra_Superior_De_Atendimento`

Bloco reutilizável, idêntico nas cinco páginas, inserido imediatamente **antes** de `<div class="app-layout">` (fora de `.app-layout`), para posicionar-se logo abaixo do `govbr-header`:

```html
<!-- ══════════ BARRA SUPERIOR DE ATENDIMENTO ══════════ -->
<nav class="barra-atendimento-topo" aria-label="Ações do atendimento">
  <a href="lista-vagas.html" class="barra-atendimento-item">
    <i class="fa-solid fa-house" aria-hidden="true"></i>
    <span>Página inicial do atendimento</span>
  </a>

  <button type="button"
          class="barra-atendimento-item barra-atendimento-item--finalizar"
          data-modal-target="modal-finalizar-atendimento"
          aria-haspopup="dialog">
    <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
    <span>Finalizar o atendimento</span>
  </button>
</nav>
```

Observações:

- A ordem dos dois itens (`Requisito 1.3`) é: atalho inicial → finalizar.
- O primeiro item é uma âncora (`<a>`) com destino explícito `lista-vagas.html` (`Requisito 2.2`), garantindo navegação sem depender de JavaScript.
- O segundo item é um `<button type="button">` com `data-modal-target="modal-finalizar-atendimento"` (`Requisitos 3.1` e `3.2`). Esse é o padrão de acionamento de modais já usado no projeto (ex.: `data-modal-target="modal-flexibilizar"` em `index.html`/`detalhes-vaga.html`): `initModals()` de `app.js` liga o clique de qualquer elemento com `data-modal-target` à chamada `openModal(id)`, sem código novo. O atributo `aria-haspopup="dialog"` segue o padrão dos demais gatilhos de modal.
- Ambos os itens reutilizam a classe existente `.barra-atendimento-item` (o botão "Finalizar" recebe o modificador `--finalizar`, em tom de alerta).
- Ícones do Font Awesome (`fa-house`, `fa-right-from-bracket`) com `aria-hidden="true"`, pois o rótulo textual já é acessível.

### 2. Markup da `Barra_Inferior_De_Atendimento`

Rodapé fixo já existente, agora contendo **apenas** o Indicador_De_Duração. Bloco reutilizável, idêntico nas cinco páginas, inserido antes de `<script src="app.js"></script>`:

```html
<!-- ══════════ BARRA INFERIOR DE ATENDIMENTO ══════════ -->
<footer class="barra-atendimento" role="contentinfo" aria-label="Duração do atendimento">
  <div class="barra-atendimento-duracao">
    <i class="fa-regular fa-clock" aria-hidden="true"></i>
    <span>Duração do atendimento:</span>
    <strong class="barra-atendimento-tempo">00:25</strong>
  </div>
</footer>
```

Observações:

- Contém somente o Indicador_De_Duração (`Requisito 1.6`).
- O indicador é texto estático (`Requisitos 4.1` e `4.2`); nenhum script atualiza o valor `00:25`.
- Ícone `fa-clock` com `aria-hidden="true"`, pois o rótulo textual já é acessível.

### 3. Markup do `Modal_De_Confirmacao_Finalizacao`

Bloco reutilizável, idêntico nas cinco páginas, inserido logo após o `<footer class="barra-atendimento">` (fora de `.app-layout`, antes de `<script src="app.js">`). Reutiliza integralmente as classes de modal já definidas em `style.css` e o ciclo de abertura/fechamento de `app.js` (`openModal`/`closeModal`, fechar no overlay, fechar com ESC). O `id` `modal-finalizar-atendimento` corresponde ao `data-modal-target` do botão da Barra_Superior.

```html
<!-- ╔══════════ MODAL — Finalizar atendimento ══════════╗ -->
<div class="govbr-modal-overlay"
     id="modal-finalizar-atendimento"
     role="dialog"
     aria-modal="true"
     aria-labelledby="modal-finalizar-title">

  <div class="govbr-modal">
    <div class="modal-header">
      <h2 class="modal-title" id="modal-finalizar-title">Finalizar atendimento</h2>
      <button class="modal-close-btn"
              data-modal-close="modal-finalizar-atendimento"
              aria-label="Fechar modal">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="modal-body">
      <p class="modal-desc">
        Deseja realmente finalizar o atendimento ao empregador DIRECAO GERAL BB?
      </p>
    </div>

    <div class="modal-footer">
      <!-- "Não": fecha o modal e permanece na página (padrão data-modal-close) -->
      <button class="govbr-btn govbr-btn-secondary"
              type="button"
              data-modal-close="modal-finalizar-atendimento">
        Não
      </button>
      <!-- "Sim": navega para logout.html -->
      <a href="logout.html" class="govbr-btn govbr-btn-danger" role="button">
        Sim
      </a>
    </div>
  </div>
</div>
```

Observações:

- **Abertura** (`Requisito 3.2`): ocorre via `openModal('modal-finalizar-atendimento')`, disparado pelo `data-modal-target` do botão da Barra_Superior e tratado por `initModals()`. Não há chamada manual de JavaScript por página — o comportamento é obtido apenas pelo markup, como nos modais existentes.
- **Pergunta com o Nome_Do_Empregador** (`Requisito 3.3`): o texto "Deseja realmente finalizar o atendimento ao empregador DIRECAO GERAL BB?" fica dentro do `.modal-body` como conteúdo estático; "DIRECAO GERAL BB" é fixo no protótipo.
- **Botões "Sim" e "Não"** (`Requisito 3.4`): ficam no `.modal-footer`, seguindo a hierarquia visual dos demais modais (secundário à esquerda, ação principal à direita).
- **"Sim" navega para logout.html** (`Requisito 3.5`): âncora (`<a href="logout.html">`) estilizada como botão (`govbr-btn govbr-btn-danger`), garantindo a navegação sem depender de JavaScript adicional. O tom `danger` reforça que a ação encerra o atendimento.
- **"Não" fecha e permanece** (`Requisito 3.6`): usa `data-modal-close="modal-finalizar-atendimento"`, o mesmo mecanismo do "X" nos modais existentes; `closeModal()` remove a classe `active` do overlay e o Atendente continua na página atual. O clique fora do modal (overlay) e a tecla ESC também fecham, por já serem tratados por `initModals()`.
- Nenhuma classe ou token novo é necessário para o modal.

### Replicação nas cinco páginas

Como o protótipo não possui mecanismo de include, os três blocos (Barra_Superior, Barra_Inferior e Modal_De_Confirmacao_Finalizacao) são inseridos **manualmente e de forma idêntica** nas cinco Páginas_De_Atendimento (`index.html`, `lista-vagas.html`, `detalhes-vaga.html`, `cadastro-trabalhador.html`, `detalhes-batimento.html`). Em cada página:

- A Barra_Superior é inserida imediatamente antes de `<div class="app-layout">`.
- A Barra_Inferior e o modal são inseridos imediatamente antes de `<script src="app.js"></script>`.
- O botão "Finalizar o atendimento" e o overlay do modal compartilham o mesmo par de identificadores (`data-modal-target="modal-finalizar-atendimento"` ↔ `id="modal-finalizar-atendimento"`), então o acionamento funciona automaticamente por já carregarem `app.js` (que executa `initModals()` no `DOMContentLoaded`).
- Como `index.html` e `detalhes-vaga.html` já possuem outros modais (`modal-flexibilizar`, `modal-legenda`, `modal-filtros-avancados`), o novo overlay convive com eles sem conflito: `initModals()` percorre todos os `[data-modal-target]` e `.govbr-modal-overlay` da página, e os `id` são únicos.

### 4. Adições ao `style.css`

Declara-se um **novo token de altura** para a barra superior no bloco `:root` (junto aos tokens de layout existentes, análogo a `--attendance-bar-height`) e adiciona-se o bloco de estilos da Barra_Superior. O bloco existente `.barra-atendimento` (rodapé) é ajustado para conter apenas a duração, e o `.main-content` recebe o novo `padding-top`. O modal **não** exige CSS novo.

```css
/* :root — adicionar junto aos tokens de layout existentes */
--attendance-topbar-height: 56px;   /* análogo a --attendance-bar-height */
```

```css
/* ╔══════════════════════════════════════════════════════════╗
   ║  BARRA SUPERIOR DE ATENDIMENTO — fixa, abaixo do header  ║
   ╚══════════════════════════════════════════════════════════╝ */
.barra-atendimento-topo {
  position: fixed;
  top: var(--header-height);            /* logo abaixo do govbr-header fixo */
  left: var(--sidebar-width);
  right: 0;
  height: var(--attendance-topbar-height);
  display: flex;
  align-items: center;
  gap: var(--spacing-scale-3);
  padding: 0 var(--spacing-scale-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-2);
  z-index: 850;                         /* acima do conteúdo; abaixo da sidebar (900) e do header (1000) */
  transition: left .25s ease;
}
```

O bloco existente `.barra-atendimento-item` (e seus estados `:hover`, `:focus`, mais o modificador `--finalizar`) é **reutilizado sem alteração** pelos dois itens da Barra_Superior — nenhuma duplicação é necessária.

Ajuste do rodapé existente (`.barra-atendimento`) — como agora contém apenas a duração, o Indicador_De_Duração é alinhado à direita (mantendo o padrão anterior em que a duração ficava empurrada à direita). Isso é obtido mantendo a regra existente `.barra-atendimento-duracao { margin-left: auto; }`, que continua funcionando com um único filho no `flex`. O restante do bloco `.barra-atendimento` (posição fixa no rodapé, altura, tokens, `z-index: 800`) permanece inalterado:

```css
/* .barra-atendimento (rodapé) — inalterado; agora contém só a duração */
.barra-atendimento {
  position: fixed;
  left: var(--sidebar-width);
  right: 0;
  bottom: 0;
  height: var(--attendance-bar-height);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-scale-4);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: var(--shadow-2);
  z-index: 800;
  transition: left .25s ease;
}

/* Indicador de duração — permanece empurrado à direita (margin-left: auto) */
.barra-atendimento-duracao {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-scale-half);
  margin-left: auto;
  font-size: var(--font-size-scale-down-01);
  color: var(--color-text-secondary);
}
```

Ajuste do `.main-content` — reserva de espaço para as duas barras. O `padding-top` é adicionado (o header já é compensado por `.app-layout`); o `padding-bottom` já existente é mantido:

```css
.main-content {
  /* ...regras existentes... */
  padding-top: calc(var(--attendance-topbar-height) + var(--spacing-scale-4));
  padding-bottom: calc(var(--attendance-bar-height) + var(--spacing-scale-4));
}
```

```css
/* Responsividade — dentro do bloco @media (max-width: 768px) existente */
.barra-atendimento-topo { left: 0; }   /* --sidebar-width já é 0px no mobile; regra explícita por clareza */
.barra-atendimento { left: 0; }        /* já existente */
```

Notas de consistência:

- Todas as cores, espaçamentos, raios, tipografia e sombras vêm de tokens (`Requisitos 1.7` e `1.8`).
- Hierarquia de camadas: header (`1000`) > sidebar (`900`) > barra superior (`850`) > barra inferior (`800`) > conteúdo. A barra superior nunca sobrepõe o menu lateral (nem o drawer mobile `z-index 950`).
- As regras de `padding-top`/`padding-bottom` em `.main-content` atendem aos `Requisitos 6.3` e `6.4` e usam as mesmas alturas declaradas para as barras, evitando dessincronização. O espaçamento superior não é duplicado porque o header já é compensado por `app-layout`.

### 5. Página `logout.html`

Nova página estática no padrão GOV.BR, reutilizando `style.css`, o Font Awesome e a estrutura de header/layout do projeto. É uma página de confirmação simples, centralizada, **sem** as barras de atendimento (o atendimento já foi encerrado). É o destino do botão "Sim" do `Modal_De_Confirmacao_Finalizacao` e exibe a confirmação "Atendimento finalizado".

Estrutura:

```
body
├── a.skip-link
├── header.govbr-header            (mesmo header das demais páginas)
└── main.main-content (centralizado)
    └── div.logout-card
        ├── i.fa-circle-check       (ícone de sucesso)
        ├── h1 "Atendimento finalizado"
        ├── p  (mensagem de apoio)
        └── a.govbr-btn.govbr-btn-primary[href=lista-vagas.html] "Iniciar novo atendimento"
```

Esboço do conteúdo principal:

```html
<main class="main-content main-content--centered" id="main-content" role="main">
  <div class="logout-card">
    <i class="fa-solid fa-circle-check logout-icon" aria-hidden="true"></i>
    <h1 class="page-title">Atendimento finalizado</h1>
    <p class="logout-message">O atendimento foi encerrado com sucesso.</p>
    <a href="lista-vagas.html" class="govbr-btn govbr-btn-primary">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      Iniciar novo atendimento
    </a>
  </div>
</main>
```

Estilos específicos da página de logout (em bloco `<style>` local à página, seguindo o padrão dos estilos específicos de tela já usado em `lista-vagas.html`), todos baseados em tokens:

```css
.main-content--centered {
  margin-left: 0;                 /* logout não usa sidebar */
  padding-top: var(--spacing-scale-4);   /* sem barra superior; sem reserva extra */
  padding-bottom: var(--spacing-scale-4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.logout-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--surface-rounder-lg);
  box-shadow: var(--shadow-2);
  padding: var(--spacing-scale-6);
  max-width: 480px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-scale-3);
}
.logout-icon { font-size: 48px; color: var(--color-success); }
.logout-message { color: var(--color-text-secondary); }
```

A página de logout não inclui a sidebar, as barras de atendimento nem `.app-layout`, portanto define `margin-left: 0` no `main-content` e não reserva espaço para as barras. O botão de retorno navega para `lista-vagas.html` (`Requisito 5.4`).

## Modelos de Dados

Não há dados dinâmicos nem estruturas persistidas. Os únicos "dados" são valores estáticos de apresentação:

| Elemento | Barra | Valor | Origem |
|---|---|---|---|
| Rótulo atalho inicial | Superior | "Página inicial do atendimento" | markup estático |
| Destino do atalho | Superior | `lista-vagas.html` | atributo `href` |
| Rótulo finalizar | Superior | "Finalizar o atendimento" | markup estático |
| Ação do finalizar | Superior | abre `modal-finalizar-atendimento` | atributo `data-modal-target` |
| Pergunta do modal | Modal | "Deseja realmente finalizar o atendimento ao empregador DIRECAO GERAL BB?" | markup estático |
| Nome do empregador | Modal | "DIRECAO GERAL BB" | markup estático (imutável) |
| Rótulo botão de confirmação | Modal | "Sim" | markup estático |
| Destino do botão "Sim" | Modal | `logout.html` | atributo `href` |
| Rótulo botão de cancelamento | Modal | "Não" | markup estático |
| Ação do botão "Não" | Modal | fecha `modal-finalizar-atendimento` | atributo `data-modal-close` |
| Rótulo duração | Inferior | "Duração do atendimento:" | markup estático |
| Valor da duração | Inferior | "00:25" | markup estático (imutável) |

## Tratamento de Erros

Por serem componentes estáticos de navegação, não há estados de erro em tempo de execução a tratar. Considerações defensivas:

- **Links quebrados**: os destinos (`lista-vagas.html`, `logout.html`) devem existir no diretório do projeto. `logout.html` é criada por esta funcionalidade; `lista-vagas.html` já existe.
- **Sobreposição de conteúdo**: mitigada pela reserva de `padding-top` (barra superior, `Requisito 6.3`) e `padding-bottom` (barra inferior, `Requisito 6.4`) em `.main-content`, sem duplicar o espaçamento do header (já compensado por `app-layout`).
- **Sobreposição entre camadas**: a hierarquia de `z-index` (header 1000 > sidebar 900 > barra superior 850 > barra inferior 800) evita que a barra superior cubra o menu lateral ou o drawer mobile.
- **Acionamento do modal sem `app.js`**: a abertura do `Modal_De_Confirmacao_Finalizacao` depende de `initModals()` (carregado por `app.js`). Todas as cinco Páginas_De_Atendimento já carregam `app.js` ao final do `<body>`, então o gatilho `data-modal-target` é ligado automaticamente. Caso o script falhe ao carregar, o overlay permanece oculto (estado padrão, sem a classe `active`) — não há navegação acidental para `logout.html`.
- **Colisão de identificadores**: o `id` `modal-finalizar-atendimento` é único em cada página e não coincide com os modais já existentes (`modal-flexibilizar`, `modal-legenda`, `modal-filtros-avancados`), evitando conflitos em `openModal`/`closeModal`.
- **Consistência entre páginas**: como o markup é replicado manualmente nas cinco páginas (não há mecanismo de include no protótipo), os três blocos (Barra_Superior, Barra_Inferior e modal) devem ser inseridos de forma idêntica, com os mesmos rótulos, ordem, `id`/`data-modal-target` e destinos, para evitar divergência entre telas.

## Estratégia de Testes

O protótipo é estático e sem ferramenta de build, então a validação é majoritariamente estrutural e visual, complementada por uma verificação de consistência entre as páginas.

**Verificações por exemplo (inspeção de markup/CSS e teste visual):**
- Barra superior fixa logo abaixo do header e visível durante a rolagem (`Requisitos 1.1`, `1.2`).
- Barra inferior fixa no rodapé e visível durante a rolagem (`Requisitos 1.4`, `1.5`).
- Presença e ordem dos dois itens de navegação na barra superior (`Requisito 1.3`).
- Presença do Indicador_De_Duração na barra inferior (`Requisito 1.6`).
- Uso de tokens de design nos estilos de ambas as barras (`Requisitos 1.7`, `1.8`).
- Destino de navegação correto do atalho inicial (`Requisito 2.2`) e do botão "Iniciar novo atendimento" da página de logout (`Requisito 5.4`).
- Acionamento do modal: clicar em "Finalizar o atendimento" abre o `Modal_De_Confirmacao_Finalizacao` (`Requisitos 3.1`, `3.2`); confirmar `data-modal-target` no botão e `id` correspondente no overlay.
- Conteúdo do modal: a pergunta contém "DIRECAO GERAL BB" (`Requisito 3.3`) e há exatamente os botões "Sim" e "Não" (`Requisito 3.4`).
- Comportamento do "Sim": navega para `logout.html` (`Requisito 3.5`).
- Comportamento do "Não" (e do "X"/overlay/ESC): fecha o modal e mantém o Atendente na página atual (`Requisito 3.6`).
- Texto e imutabilidade do indicador de duração (`Requisitos 4.1`, `4.2`).
- Existência e padrão GOV.BR de `logout.html`, mensagem "Atendimento finalizado" e botão (`Requisitos 5.1`, `5.2`, `5.3`).
- `padding-top` e `padding-bottom` do `main-content` compatíveis com as alturas das barras (`Requisitos 6.3`, `6.4`).

**Verificação de propriedade (consistência entre páginas):**
- Para cada uma das cinco páginas de atendimento, confirmar que as duas barras e o modal estão presentes com rótulos, ordem, `id`/`data-modal-target`, pergunta, botões e valor de duração idênticos (`Requisitos 6.1`, `6.2`).

## Correctness Properties

*Uma propriedade é uma característica ou comportamento que deve valer para todas as execuções válidas de um sistema — essencialmente, uma afirmação formal sobre o que o sistema deve fazer. As propriedades servem de ponte entre especificações legíveis por humanos e garantias de correção verificáveis por máquina.*

Este é um protótipo estático de UI. A maioria dos critérios de aceitação descreve estrutura de markup fixo, estilo por tokens, texto estático e comportamento determinístico de UI (abrir/fechar modal, navegação por `href`), que são melhor validados por inspeção/exemplos (ver Estratégia de Testes) e não por testes baseados em propriedades. A única característica com quantificação universal significativa é a presença consistente das duas barras e do modal sobre o conjunto enumerável de páginas de atendimento.

### Property 1: Presença consistente das duas barras e do modal em todas as páginas de atendimento

*Para toda* página de atendimento do conjunto {`index.html`, `lista-vagas.html`, `detalhes-vaga.html`, `cadastro-trabalhador.html`, `detalhes-batimento.html`}, o documento deve conter: (a) a `Barra_Superior_De_Atendimento` com exatamente os dois itens de navegação na ordem definida — o primeiro um link para `lista-vagas.html` ("Página inicial do atendimento") e o segundo um gatilho ("Finalizar o atendimento") com `data-modal-target="modal-finalizar-atendimento"` (sem `href` para `logout.html`); (b) a `Barra_Inferior_De_Atendimento` contendo o Indicador_De_Duração com o valor "00:25"; e (c) o `Modal_De_Confirmacao_Finalizacao` com `id="modal-finalizar-atendimento"`, a pergunta contendo "DIRECAO GERAL BB", o botão "Sim" apontando para `logout.html` e o botão "Não" que fecha o modal (`data-modal-close`).

**Validates: Requirements 6.1, 6.2**
