# Plano de Implementação: Gestão de Encaminhamentos e Lista de Vagas

## Visão Geral

Protótipo estático (HTML/CSS/JS puros, sem build). O trabalho tem dois focos independentes:

1. Adaptar `lista-vagas.html` (CSS local + markup da tabela `#table-vagas`) — todas as edições ocorrem no mesmo arquivo e devem ser feitas de forma sequencial.
2. Criar a nova página `gestao-encaminhamentos.html` (casca padrão + accordions + tabela de encaminhamentos + ações via `window.showToast`) — arquivo distinto, pode ser produzido em paralelo às edições de `lista-vagas.html`.

Ao final, uma verificação opcional (Property 1) garante a consistência das 10 linhas da tabela de vagas.

## Tasks

- [x] 1. Adaptar `lista-vagas.html` (edições sequenciais no mesmo arquivo)
  - [x] 1.1 Adicionar CSS local no bloco `<style>` de `lista-vagas.html`
    - Adicionar regra de largura estreita e centralização para a 1ª coluna: `#table-vagas thead th:first-child, #table-vagas tbody td:first-child { width: 40px; text-align: center; }`
    - Adicionar a classe `.vaga-status-icon` (display inline-flex, dimensões, `font-size` e `color` baseados em tokens do `style.css`)
    - Adicionar os modificadores opcionais `.vaga-status-icon--interesse` e `.vaga-status-icon--convocacao` usando tokens (`--color-primary`, `--color-text-secondary`)
    - _Requirements: 2.1, 2.2_

  - [x] 1.2 Inserir novo `<th>` vazio como primeira coluna do `thead` de `#table-vagas`
    - Adicionar um `<th>` vazio e estreito como primeira coluna do cabeçalho, mantendo a contagem de colunas coerente com o corpo (8 colunas)
    - _Requirements: 2.1_

  - [x] 1.3 Adicionar o Indicador_De_Status como primeira `<td>` de cada uma das 10 linhas
    - Inserir, como primeira célula de cada `<tr>`, um `<span class="vaga-status-icon" role="img">` não clicável (sem `href`) com ícone interno `aria-hidden="true"`
    - Linhas COM X (`fa-user-slash`, tooltip "Essa vaga está disponível para manifestação de interesse"): 101040, 101002, 101000, 100922, 100522
    - Linhas SEM X (`fa-user`, tooltip "Essa vaga está disponível para convocação"): 101039, 101001, 100999, 100920, 100319
    - Definir `title` e `aria-label` do span com o texto correspondente ao estado
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 1.4 Ajustar o tooltip da lupa em cada uma das 10 linhas
    - Alterar `title` e `aria-label` da lupa para "Visualizar a vaga e encaminhar trabalhador"
    - Manter o `href` `index.html?vaga=XXXX` e a classe `fa-magnifying-glass`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.5 Substituir o boneco de ação pelo ícone de Gestão de encaminhamentos em cada uma das 10 linhas
    - Remover o antigo `<a>` de ação com `fa-user-plus`/`btn-icon-action--circle`
    - Inserir `<a class="btn-icon-action" href="gestao-encaminhamentos.html?vaga=XXXX" title="Gestão de encaminhamentos" aria-label="Gestão de encaminhamentos"><i class="fa-solid fa-people-arrows"></i></a>`, usando o mesmo `XXXX` da linha
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 2. Criar `gestao-encaminhamentos.html` (arquivo novo, independente)
  - [x] 2.1 Criar a casca padrão da página
    - `<head>` com `<link rel="stylesheet" href="style.css">` e Font Awesome via CDN (6.4.2)
    - `.skip-link`, `header.govbr-header`, `.sidebar-overlay`, `nav.barra-atendimento-topo`
    - `.app-layout` com `nav.govbr-sidebar` + `main.main-content#main-content`
    - `footer.barra-atendimento`, modal `#modal-finalizar-atendimento`, `<script src="app.js"></script>` seguido do `<script>` inline
    - Título "Identificação do empregador que oferece a vaga"
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.2 Adicionar o Accordion 1 — Identificação do empregador
    - Usar `.govbr-accordion` > `.accordion-header open` + `.accordion-icon` + `.accordion-body expanded` > `.accordion-content` (toggle automático via `initAccordions` do `app.js`)
    - Campos/valores: Tipo de identificação = CNPJ; Número de identificação = 08.811.226/0019-03; Nome de Fantasia = CAFE SAO BRAZ; Contato = Nome; Telefone = (27) 99999-1234
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 2.3 Adicionar o Accordion 2 — Dados da vaga (rótulo "Ocultar")
    - Usar o mesmo padrão de accordion (inicia aberto) com rótulo textual "Ocultar" ao lado do chevron; o recolhimento é feito pelo `toggleAccordion` do `app.js`
    - Campos/valores: Número de identificação = 99920; Data de cadastro = 04/12/2025; Tipo de intermediação = Por ocupação; Ocupação = 5134-35 - Atendente de lanchonete; Contratação = Permanente; Encerrada? = Sim; Status da vaga = Prazo de validade expirado; Direcionamento = Indiferente; Iniciativa = Empregador; Data final prevista para retorno do encaminhamento = 05/12/2025; Quantidade de vagas oferecidas = 3; Reposição = 3; Aumento de quadro = 0; Vagas canceladas = 0
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12, 6.13, 6.14, 6.15, 6.16_

  - [x] 2.4 Adicionar a tabela "Encaminhamentos Pendentes de retorno" (`#table-encaminhamentos`)
    - Usar `.table-section` + `.table-header-row`/`.table-title` + `.govbr-table`
    - Colunas: SD (`fa-eye-slash`) e PRONATEC (`fa-graduation-cap`) como indicadores não clicáveis (`<span role="img">` com `title`/`aria-label` completos "Trabalhador não monitorado pelo SD" e "Trabalhador sem curso concluído no PRONATEC"), PIS/PASEP/NIS/NIT, Nome do trabalhador, Data, Ações
    - Ações por linha: Imprimir (`fa-print`, `data-acao="imprimir"`) e Registrar o resultado do encaminhamento (`fa-clipboard-check`, `data-acao="registrar"`), ambos `.btn-icon-action`
    - 3 linhas: (190.18588.38-8 / Cicero Joao da Silva / 04/12/2025), (214.63337.84-3 / Fulano Dtgcpqv Raxduichf / 04/12/2025), (567.84565.75-4 / Jacy Afonso de Melo / 04/12/2025)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 2.5 Adicionar o botão "Salvar XLS" e o rodapé de ações
    - Botão "Salvar XLS" (`fa-file-excel`, id `btn-salvar-xls`)
    - Rodapé com "Encaminhamentos Pendentes de retorno" (id `btn-encaminhamentos-pendentes`) e "Cancelar" (id `btn-cancelar`, `onclick="window.location.href='lista-vagas.html'"`)
    - _Requirements: 7.7, 7.8_

  - [x] 2.6 Implementar o `<script>` inline de comportamento do protótipo
    - Delegação de clique em `#table-encaminhamentos` para `data-acao="imprimir"` e `data-acao="registrar"` chamando `window.showToast`
    - Listener do botão "Salvar XLS" via `showToast`
    - Listener do botão "Encaminhamentos Pendentes de retorno" via `showToast`
    - Usar optional chaining (`?.`) e checar `window.showToast &&` antes de invocar
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x]* 3. Checkpoint - Verificar consistência das linhas da Tabela_De_Vagas
  - **Property 1: Consistência das linhas da Tabela_De_Vagas**
  - Para cada uma das 10 linhas de `#table-vagas`: confirmar exatamente 1 indicador não clicável na 1ª coluna com o tooltip correto conforme o estado (com/sem X); lupa com tooltip "Visualizar a vaga e encaminhar trabalhador" e `href` `index.html?vaga=<id>`; ícone de gestão com `href` `gestao-encaminhamentos.html?vaga=<id>`, usando o MESMO `<id>` da linha em ambos os links
  - Ensure all tests pass, ask the user if questions arise.
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4**

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- As edições em `lista-vagas.html` (1.1–1.5) ocorrem no mesmo arquivo e são sequenciais para evitar conflitos
- A criação de `gestao-encaminhamentos.html` (2.1–2.6) é independente e pode ocorrer em paralelo às edições de `lista-vagas.html`
- O checkpoint (Property 1) é a última etapa, após a lista de vagas estar concluída

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["1.3", "2.5", "2.6"] },
    { "id": 3, "tasks": ["1.4"] },
    { "id": 4, "tasks": ["1.5"] },
    { "id": 5, "tasks": ["3"] }
  ]
}
```
