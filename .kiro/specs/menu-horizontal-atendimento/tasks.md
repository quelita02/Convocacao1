# Plano de Implementação: Menu Horizontal de Atendimento (migração para duas barras)

## Visão Geral

Esta iteração **migra** o layout atual — em que uma única `<footer class="barra-atendimento">` no rodapé concentra os três elementos (atalho "Página inicial do atendimento", botão "Finalizar o atendimento" e o Indicador_De_Duração "00:25") — para o novo layout com **duas barras**:

- **Barra_Superior_De_Atendimento** (`nav.barra-atendimento-topo`): fixa no topo, logo abaixo do `govbr-header`, contendo os **dois itens de navegação** (atalho inicial e finalizar).
- **Barra_Inferior_De_Atendimento** (`footer.barra-atendimento`): rodapé fixo já existente, reduzido para conter **apenas** o Indicador_De_Duração ("Duração do atendimento: 00:25").

O `Modal_De_Confirmacao_Finalizacao` (`#modal-finalizar-atendimento`) permanece **inalterado** e continua antes de `<script src="app.js"></script>`. A `logout.html` já está pronta (não requer novas tarefas).

Como o protótipo é estático (HTML/CSS/JS puro, sem build) e sem mecanismo de include, o trabalho consiste em: (1) ajustar `style.css` (novo token e novo bloco da barra superior, `padding-top` do conteúdo e regra responsiva; boa parte da folha já satisfeita — descrito como "garantir/adicionar se ausente"); (2) migrar o markup nas cinco páginas, movendo os dois itens de navegação do rodapé para a nova barra superior e deixando o rodapé só com a duração; e (3) verificar a consistência entre as páginas.

## Tasks

- [ ] 1. Ajustar `style.css` para o layout de duas barras
  - Reutiliza integralmente `.barra-atendimento-item` (com seu reset de `<button>`, estados `:hover`/`:focus` e o modificador `--finalizar`) — **sem duplicar** — nos itens da barra superior. O `Modal_De_Confirmacao_Finalizacao` continua **sem** CSS novo.

  - [ ] 1.1 Adicionar o token `--attendance-topbar-height` no `:root`
    - Garantir/adicionar (se ausente) `--attendance-topbar-height: 56px;` junto aos tokens de layout existentes, análogo a `--attendance-bar-height`
    - _Requirements: 1.1, 6.1, 6.3_

  - [ ] 1.2 Adicionar o bloco `.barra-atendimento-topo` ao `style.css`
    - Estilizar a barra superior fixa: `position: fixed; top: var(--header-height); left: var(--sidebar-width); right: 0; height: var(--attendance-topbar-height);` com `display: flex; align-items: center; gap: var(--spacing-scale-3); padding: 0 var(--spacing-scale-4);`
    - Aplicar somente tokens: `background: var(--color-surface); border-bottom: 1px solid var(--color-border); box-shadow: var(--shadow-2);` e `z-index: 850` (acima do conteúdo, abaixo da sidebar 900 e do header 1000); `transition: left .25s ease`
    - **Reutilizar** o `.barra-atendimento-item` existente para os dois itens (não duplicar regras)
    - Confirmar que o bloco `.barra-atendimento` (rodapé) permanece válido contendo apenas o `.barra-atendimento-duracao` (com `margin-left: auto`, que segue funcionando com um único filho no flex) — sem CSS novo obrigatório além do descrito nesta task
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 1.8_

  - [ ] 1.3 Reservar espaço superior no `.main-content`
    - Adicionar `padding-top: calc(var(--attendance-topbar-height) + var(--spacing-scale-4));` ao `.main-content`, **mantendo** o `padding-bottom: calc(var(--attendance-bar-height) + var(--spacing-scale-4));` já existente (o header já é compensado pelo `padding-top` do `.app-layout`, então o espaçamento não é duplicado)
    - _Requirements: 6.3, 6.4_

  - [ ] 1.4 Adicionar a regra responsiva da barra superior
    - Dentro do bloco `@media (max-width: 768px)` existente, garantir/adicionar `.barra-atendimento-topo { left: 0; }` (o `.barra-atendimento { left: 0; }` já existe)
    - _Requirements: 1.1, 1.2_

- [ ] 2. Migrar o markup das cinco páginas de atendimento (barra única → duas barras)
  - Em cada página, aplicar de forma **idêntica** três mudanças: (a) inserir a nova `<nav class="barra-atendimento-topo" aria-label="Ações do atendimento">` imediatamente **antes** de `<div class="app-layout">`, contendo `<a href="lista-vagas.html" class="barra-atendimento-item">` (ícone `fa-house`, "Página inicial do atendimento") e `<button type="button" class="barra-atendimento-item barra-atendimento-item--finalizar" data-modal-target="modal-finalizar-atendimento" aria-haspopup="dialog">` (ícone `fa-right-from-bracket`, "Finalizar o atendimento"); (b) **remover** do `<footer class="barra-atendimento">` do rodapé os dois itens de navegação (o atalho e o botão finalizar), deixando o footer com **apenas** o `.barra-atendimento-duracao` (ícone `fa-clock` + "Duração do atendimento:" + "00:25") e atualizar seu `aria-label` para "Duração do atendimento"; (c) **manter** o `#modal-finalizar-atendimento` inalterado, antes de `<script src="app.js"></script>`.

  - [ ] 2.1 Migrar `index.html`
    - Inserir a `nav.barra-atendimento-topo` antes de `<div class="app-layout">`; reduzir o `footer.barra-atendimento` para só a duração; manter o modal inalterado
    - _Requirements: 1.3, 2.1, 2.2, 3.1, 3.2, 6.1, 6.2_

  - [ ] 2.2 Migrar `lista-vagas.html`
    - Aplicar as três mudanças idênticas (barra superior antes do `app-layout`, rodapé só com duração, modal inalterado)
    - _Requirements: 1.3, 2.1, 2.2, 3.1, 3.2, 6.1, 6.2_

  - [ ] 2.3 Migrar `detalhes-vaga.html`
    - Aplicar as três mudanças idênticas; confirmar que a barra superior não conflita com os modais preexistentes (`modal-flexibilizar`, `modal-filtros-avancados`)
    - _Requirements: 1.3, 2.1, 2.2, 3.1, 3.2, 6.1, 6.2_

  - [ ] 2.4 Migrar `cadastro-trabalhador.html`
    - Aplicar as três mudanças idênticas (barra superior antes do `app-layout`, rodapé só com duração, modal inalterado)
    - _Requirements: 1.3, 2.1, 2.2, 3.1, 3.2, 6.1, 6.2_

  - [ ] 2.5 Migrar `detalhes-batimento.html`
    - Aplicar as três mudanças idênticas (barra superior antes do `app-layout`, rodapé só com duração, modal inalterado)
    - _Requirements: 1.3, 2.1, 2.2, 3.1, 3.2, 6.1, 6.2_

- [ ] 3. Checkpoint - Consistência entre páginas
  - [ ]* 3.1 Verificar a consistência das duas barras e do modal nas cinco páginas
    - **Property 1: Presença consistente das duas barras e do modal em todas as páginas de atendimento**
    - **Validates: Requirements 6.1, 6.2**
    - Confirmar que `index.html`, `lista-vagas.html`, `detalhes-vaga.html`, `cadastro-trabalhador.html` e `detalhes-batimento.html` contêm, de forma idêntica: (a) a **barra superior** com exatamente os dois itens na ordem correta — atalho `<a href="lista-vagas.html">` ("Página inicial do atendimento") seguido do gatilho `<button data-modal-target="modal-finalizar-atendimento">` ("Finalizar o atendimento", **sem** `href` para `logout.html`); (b) a **barra inferior** contendo **apenas** a duração "00:25"; e (c) o modal `#modal-finalizar-atendimento` presente e íntegro — `id` correto, pergunta contendo "DIRECAO GERAL BB", botão "Sim" apontando para `logout.html` e botão "Não" com `data-modal-close`
    - Verificar o pareamento `data-modal-target` ↔ `id` e a unicidade do `id` frente aos modais preexistentes
    - (Opcional) Verificar que `logout.html` continua íntegra: mensagem "Atendimento finalizado" e botão "Iniciar novo atendimento" apontando para `lista-vagas.html`
  - Garantir que todas as verificações passem; em caso de dúvidas, consultar o usuário.

## Notes

- As tarefas marcadas com `*` são opcionais (verificação/teste) e podem ser puladas em um MVP mais rápido.
- Muitas regras de `style.css` já existem da iteração anterior (token `--attendance-bar-height`, blocos `.barra-atendimento`, `.barra-atendimento-item`, estados hover/focus, `--finalizar`, `.barra-atendimento-duracao`, `.barra-atendimento-tempo`, `padding-bottom` do `.main-content` e a regra responsiva). Por isso, as tasks de CSS são descritas como "garantir/adicionar se ausente".
- A Task 1 (CSS) deve preceder a Task 2 (markup), para que a barra superior seja renderizada corretamente ao ser adicionada.
- A migração deve ser idêntica nas cinco páginas (mesmos rótulos, ordem, `id`/`data-modal-target`, pergunta e destinos), pois não há mecanismo de include no protótipo.
- A abertura/fechamento do modal não exige JavaScript novo: reutiliza `initModals()`/`openModal`/`closeModal` de `app.js`, já carregado em todas as páginas.
- A `logout.html` já está implementada; nenhuma task de criação é necessária (apenas verificação opcional).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 3, "tasks": ["3.1"] }
  ]
}
```
