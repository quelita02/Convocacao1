# Documento de Requisitos

## Introdução

Este documento descreve os requisitos para reorganizar o fluxo de convocação de trabalhadores no protótipo estático GOV.BR do sistema IMO (Intermediação de Mão-de-Obra). Atualmente, a página `visualizar-vaga.html` concentra tanto os dados da vaga (metade superior) quanto o fluxo operacional de convocação (metade inferior: critérios flexíveis, filtros, tabela de trabalhadores e botões de convocação). Esta reorganização separa esses dois conjuntos de responsabilidades em páginas distintas, ajusta a tabela de vagas em `lista-vagas.html` para transformar o indicador de status (boneco) em uma ação de convocação, e cria a nova página `convocacao.html`.

O protótipo é estático (HTML, CSS e JavaScript), utiliza o arquivo compartilhado `style.css`, o arquivo compartilhado `app.js` e ícones da biblioteca Font Awesome via CDN. Nenhuma integração de back-end faz parte deste escopo.

## Glossário

- **Protótipo**: Conjunto de páginas estáticas HTML/CSS/JS do sistema IMO objeto deste documento.
- **Lista_de_Vagas**: Página `lista-vagas.html`, que exibe a tabela de vagas `#table-vagas` do empregador.
- **Tabela_de_Vagas**: Elemento `<table id="table-vagas">` presente em `Lista_de_Vagas`.
- **Pagina_Visualizar_Vaga**: Página `visualizar-vaga.html`, que exibe os dados descritivos da vaga.
- **Pagina_Convocacao**: Nova página `convocacao.html`, que concentra o fluxo operacional de convocação de trabalhadores.
- **Icone_Lupa**: Ícone Font Awesome `fa-magnifying-glass`, renderizado como âncora `<a class="btn-icon-action">`, usado como ação de visualização na `Tabela_de_Vagas`.
- **Icone_Boneco_Convocacao**: Ícone Font Awesome `fa-user` (boneco sem "x"), que representa uma vaga disponível para convocação.
- **Icone_Boneco_Interesse**: Ícone Font Awesome `fa-user-slash` (boneco com "x"), que representa uma vaga disponível para manifestação de interesse.
- **Icone_Gestao_Encaminhamentos**: Ícone Font Awesome `fa-people-arrows`, usado como ação de gestão de encaminhamentos na `Tabela_de_Vagas`.
- **Celula_de_Acoes**: Célula da coluna "Ações" da `Tabela_de_Vagas`, com a classe `vagas-actions-cell`.
- **Coluna_de_Status**: Primeira coluna da `Tabela_de_Vagas`, cujo cabeçalho é um `<th>` vazio e cujas células têm a classe `vaga-status-cell`.
- **Parametro_Vaga**: Parâmetro de consulta `?vaga=XXXX`, em que `XXXX` é o identificador numérico da vaga.
- **Metade_Superior**: Conjunto de cards de dados descritivos da vaga (Código/Título e o accordion "Exibir detalhes" com Cargo, Ocupação, Requisitos, Informações financeiras, Horário e local, Municípios de alcance, Informações adicionais e Soft Skills).
- **Metade_Inferior**: Conjunto operacional composto pela seção "Critérios flexíveis" (botão "Flexibilizar vaga"), pela seção "Filtros" (formulário `#filter-form` e link "Mais filtros"), pela seção "Trabalhadores" (tabela `#table-trabalhadores` com seleção) e pelos botões "Convocar selecionados por email" (`data-convocar-email`) e "Notificar selecionado(s) pela CTPS Digital" (`data-convocar-ctps`).
- **Modal_Flexibilizar**: Modal identificado por `modal-flexibilizar`, acionado pelo botão "Flexibilizar vaga".
- **Modal_Legenda**: Modal identificado por `modal-legenda`, acionado pelo link "Legenda" da seção de trabalhadores.
- **Modal_Filtros_Avancados**: Modal identificado por `modal-filtros-avancados`, acionado pelo link "Mais filtros", incluindo seu script inline de filtros avançados.
- **Modal_Finalizar_Atendimento**: Modal identificado por `modal-finalizar-atendimento`, comum às páginas do fluxo de atendimento.
- **App_JS**: Arquivo `app.js`, que inicializa `initModals`, `initTableSelection('table-trabalhadores')`, `initFilters`, `initFlexibilizar`, `initConvocar` e `initVerMais` quando o elemento `#table-trabalhadores` está presente.
- **Botao_Simular_Trabalhadores**: Botão "Simular Trabalhadores" existente no rodapé de `Lista_de_Vagas`.

## Requisitos

### Requisito 1 — Tooltip do ícone de visualização na tabela de vagas

**User Story:** Como atendente do SINE, quero que o ícone de lupa na tabela de vagas indique claramente a ação de visualizar a vaga, para que eu compreenda seu propósito antes de acioná-lo.

#### Acceptance Criteria

1. THE Protótipo SHALL manter o Icone_Lupa da Tabela_de_Vagas como uma âncora `<a class="btn-icon-action">` com o atributo `href` apontando para `visualizar-vaga.html?vaga=XXXX`, em que `XXXX` corresponde ao identificador da linha.
2. THE Protótipo SHALL definir o atributo `title` do Icone_Lupa como "Visualizar a vaga".
3. THE Protótipo SHALL definir o atributo `aria-label` do Icone_Lupa como "Visualizar a vaga".

### Requisito 2 — Remoção da coluna de status da tabela de vagas

**User Story:** Como atendente do SINE, quero que a tabela de vagas não exiba mais a coluna inicial de status com o indicador de boneco, para que a informação de disponibilidade fique concentrada na coluna de Ações.

#### Acceptance Criteria

1. THE Protótipo SHALL remover o cabeçalho `<th>` vazio correspondente à Coluna_de_Status do cabeçalho da Tabela_de_Vagas.
2. THE Protótipo SHALL remover todas as células `<td class="vaga-status-cell">` do corpo da Tabela_de_Vagas.
3. THE Protótipo SHALL apresentar a Tabela_de_Vagas com exatamente 7 colunas, na ordem: Identificação, Data de cadastro, Cargo, Quant., Status, Contratação e Ações.

### Requisito 3 — Ícone de boneco como ação na coluna de Ações

**User Story:** Como atendente do SINE, quero acionar a convocação diretamente pela coluna de Ações da tabela de vagas, para que eu inicie o fluxo de convocação a partir da lista.

#### Acceptance Criteria

1. THE Protótipo SHALL posicionar o ícone de boneco na Celula_de_Acoes como segundo ícone, na ordem: Icone_Lupa, ícone de boneco e Icone_Gestao_Encaminhamentos.
2. WHERE a linha da vaga está disponível para convocação, THE Protótipo SHALL renderizar o Icone_Boneco_Convocacao como uma âncora `<a class="btn-icon-action">` com `href` igual a `convocacao.html?vaga=XXXX`, em que `XXXX` corresponde ao identificador da linha.
3. WHERE a linha da vaga está disponível para convocação, THE Protótipo SHALL definir os atributos `title` e `aria-label` do Icone_Boneco_Convocacao como "Essa vaga está disponível para convocação".
4. WHERE a linha da vaga está disponível para convocação, THE Protótipo SHALL aplicar o Icone_Boneco_Convocacao às vagas de identificadores 101039, 101001, 100999, 100920 e 100319.
5. WHEN o atendente aciona o Icone_Boneco_Convocacao, THE Protótipo SHALL navegar para `convocacao.html?vaga=XXXX`, em que `XXXX` é o identificador da linha correspondente.
6. WHERE a linha da vaga está disponível para manifestação de interesse, THE Protótipo SHALL renderizar o Icone_Boneco_Interesse em estado desabilitado, sem `href` de navegação, com aparência esmaecida e com o atributo `aria-disabled="true"`.
7. WHERE a linha da vaga está disponível para manifestação de interesse, THE Protótipo SHALL definir os atributos `title` e `aria-label` do Icone_Boneco_Interesse como "Essa vaga está disponível para manifestação de interesse".
8. WHERE a linha da vaga está disponível para manifestação de interesse, THE Protótipo SHALL aplicar o Icone_Boneco_Interesse às vagas de identificadores 101040, 101002, 101000, 100922 e 100522.
9. WHEN o atendente aciona o Icone_Boneco_Interesse, THE Protótipo SHALL manter a página atual sem executar navegação.

### Requisito 4 — Criação da página de convocação

**User Story:** Como atendente do SINE, quero uma página dedicada de convocação que receba o identificador da vaga, para que eu execute o fluxo de convocação de trabalhadores de forma isolada dos dados descritivos da vaga.

#### Acceptance Criteria

1. THE Protótipo SHALL disponibilizar a Pagina_Convocacao no arquivo `convocacao.html`.
2. WHEN a Pagina_Convocacao é aberta com o Parametro_Vaga, THE Pagina_Convocacao SHALL aceitar o valor de `?vaga=XXXX` recebido na URL.
3. THE Pagina_Convocacao SHALL conter a Metade_Inferior migrada de Pagina_Visualizar_Vaga, incluindo a seção "Critérios flexíveis", a seção "Filtros", a seção "Trabalhadores" e os botões "Convocar selecionados por email" e "Notificar selecionado(s) pela CTPS Digital".
4. THE Pagina_Convocacao SHALL conter o Modal_Flexibilizar, o Modal_Legenda e o Modal_Filtros_Avancados, incluindo o script inline de filtros avançados associado ao Modal_Filtros_Avancados.
5. THE Pagina_Convocacao SHALL apresentar a estrutura padrão do Protótipo composta por header GOV.BR, barra de atendimento superior, `app-layout` com sidebar e `main-content`, barra de atendimento de rodapé e Modal_Finalizar_Atendimento.
6. THE Pagina_Convocacao SHALL exibir o título de página "Convocação".
7. THE Pagina_Convocacao SHALL exibir um card de identificação da vaga contendo os campos Código e Título.
8. THE Pagina_Convocacao SHALL exibir um controle "Voltar" que navega para `lista-vagas.html`.
9. THE Pagina_Convocacao SHALL carregar o App_JS.
10. THE Pagina_Convocacao SHALL carregar o script inline de filtros avançados.
11. WHEN a Pagina_Convocacao é carregada e o elemento `#table-trabalhadores` está presente, THE App_JS SHALL inicializar `initModals`, `initTableSelection('table-trabalhadores')`, `initFilters`, `initFlexibilizar`, `initConvocar` e `initVerMais`.

### Requisito 5 — Página de visualização restrita aos dados da vaga

**User Story:** Como atendente do SINE, quero que a página de visualização da vaga apresente apenas os dados descritivos, para que a consulta às informações da vaga fique separada do fluxo de convocação.

#### Acceptance Criteria

1. THE Pagina_Visualizar_Vaga SHALL conter apenas a Metade_Superior, com o card de Código e Título e o accordion "Exibir detalhes" contendo Cargo, Ocupação, Requisitos, Informações financeiras, Horário e local, Municípios de alcance, Informações adicionais e Soft Skills.
2. THE Pagina_Visualizar_Vaga SHALL remover a seção "Critérios flexíveis", a seção "Filtros", a seção "Trabalhadores" e os botões de convocação.
3. THE Pagina_Visualizar_Vaga SHALL remover o Modal_Flexibilizar, o Modal_Legenda e o Modal_Filtros_Avancados.
4. THE Pagina_Visualizar_Vaga SHALL manter o Modal_Finalizar_Atendimento.
5. THE Pagina_Visualizar_Vaga SHALL manter o header GOV.BR, as barras de atendimento, a sidebar e o controle "Voltar" que navega para `lista-vagas.html`.

### Requisito 6 — Consistência de navegação

**User Story:** Como atendente do SINE, quero que os atalhos de navegação apontem para os destinos corretos após a reorganização, para que eu não encontre referências quebradas ou incoerentes.

#### Acceptance Criteria

1. THE Protótipo SHALL definir o destino do Botao_Simular_Trabalhadores como `convocacao.html`.
2. THE Protótipo SHALL manter todas as referências internas de navegação apontando para arquivos existentes no Protótipo.
