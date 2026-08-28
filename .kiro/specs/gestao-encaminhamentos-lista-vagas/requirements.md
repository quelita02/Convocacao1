# Requirements Document

## Introduction

Esta funcionalidade adapta a tela de listagem de vagas (`lista-vagas.html`) do protótipo estático GOV.BR do sistema IMO e cria uma nova página `gestao-encaminhamentos.html`. Na tabela de vagas (`.govbr-table#table-vagas`), o ícone da lupa passa a ter o propósito de visualizar a vaga e encaminhar trabalhador (com ajuste apenas de tooltip), o ícone do boneco deixa de ser ação e passa a ser um indicador visual de status posicionado em uma nova primeira coluna, e é adicionado um novo ícone de ação para acessar a gestão de encaminhamentos da vaga. A nova página exibe a identificação do empregador, os dados da vaga e a relação de encaminhamentos pendentes de retorno, seguindo o padrão visual GOV.BR do projeto (header, barras de atendimento, sidebar, main-content, rodapé e modais). Por se tratar de protótipo estático (HTML/CSS/JS), as ações operacionais são apenas visuais, sem integração com backend.

## Glossary

- **Lista_De_Vagas**: Página `lista-vagas.html` que apresenta a tabela de vagas do empregador (`.govbr-table#table-vagas`).
- **Tabela_De_Vagas**: Tabela HTML identificada por `#table-vagas` contendo as linhas de vagas de exemplo.
- **Linha_De_Vaga**: Cada linha (`<tr>`) do corpo da Tabela_De_Vagas que representa uma vaga e possui um identificador de vaga.
- **Icone_Lupa**: Ícone de ação com a classe `fa-magnifying-glass` presente na célula de ações de cada Linha_De_Vaga.
- **Indicador_De_Status**: Ícone de boneco, não clicável e sem atributo `href`, exibido na primeira coluna de cada Linha_De_Vaga para indicar o status da vaga.
- **Icone_Gestao_Encaminhamentos**: Ícone de ação com a classe `fa-people-arrows` presente na célula de ações de cada Linha_De_Vaga.
- **Pagina_Gestao_Encaminhamentos**: Nova página `gestao-encaminhamentos.html` que apresenta a identificação do empregador, os dados da vaga e a tabela de encaminhamentos pendentes de retorno.
- **Tabela_Encaminhamentos**: Tabela da Pagina_Gestao_Encaminhamentos intitulada "Encaminhamentos Pendentes de retorno".
- **Sistema_Toast**: Função JavaScript global `window.showToast` do projeto, utilizada para exibir mensagens temporárias na interface.
- **Tokens_Estilo**: Variáveis de estilo (custom properties CSS) definidas em `style.css` e utilizadas para manter o padrão visual GOV.BR.

## Requirements

### Requirement 1

**User Story:** Como atendente do IMO, quero que o ícone da lupa continue permitindo visualizar a vaga e encaminhar trabalhador com um rótulo claro, para que eu compreenda a ação disponível ao usar a lupa.

#### Acceptance Criteria

1. THE Icone_Lupa SHALL permanecer um elemento de ação com destino (`href`) `index.html?vaga=XXXX`, onde `XXXX` é o identificador da Linha_De_Vaga correspondente.
2. THE Icone_Lupa SHALL utilizar o atributo `title` com o valor "Visualizar a vaga e encaminhar trabalhador".
3. THE Icone_Lupa SHALL utilizar o atributo `aria-label` com o valor "Visualizar a vaga e encaminhar trabalhador".
4. THE Icone_Lupa SHALL manter a classe de ícone `fa-magnifying-glass`.

### Requirement 2

**User Story:** Como atendente do IMO, quero identificar visualmente o status de cada vaga na primeira coluna da tabela, para que eu saiba se a vaga está disponível para manifestação de interesse ou para convocação.

#### Acceptance Criteria

1. THE Tabela_De_Vagas SHALL apresentar uma nova primeira coluna cujo cabeçalho (`<th>`) é vazio, sem título, com largura estreita.
2. THE Indicador_De_Status SHALL ser exibido na nova primeira coluna de cada Linha_De_Vaga.
3. THE Indicador_De_Status SHALL ser um elemento não clicável e sem atributo `href`.
4. WHERE a vaga está disponível para manifestação de interesse, THE Indicador_De_Status SHALL exibir o ícone de boneco com marcação "X" e utilizar os atributos `title` e `aria-label` com o valor "Essa vaga está disponível para manifestação de interesse".
5. WHERE a vaga está disponível para convocação, THE Indicador_De_Status SHALL exibir o ícone de boneco sem marcação "X" e utilizar os atributos `title` e `aria-label` com o valor "Essa vaga está disponível para convocação".
6. THE Tabela_De_Vagas SHALL apresentar, entre as 10 Linhas_De_Vaga de exemplo, ao menos uma linha com Indicador_De_Status com "X" e ao menos uma linha com Indicador_De_Status sem "X".

### Requirement 3

**User Story:** Como atendente do IMO, quero acessar a gestão de encaminhamentos de uma vaga diretamente pela tabela, para que eu gerencie os encaminhamentos pendentes de retorno daquela vaga.

#### Acceptance Criteria

1. THE Tabela_De_Vagas SHALL apresentar o Icone_Gestao_Encaminhamentos na célula de ações de cada Linha_De_Vaga.
2. THE Icone_Gestao_Encaminhamentos SHALL utilizar a classe de ícone `fa-people-arrows`.
3. THE Icone_Gestao_Encaminhamentos SHALL utilizar os atributos `title` e `aria-label` com o valor "Gestão de encaminhamentos".
4. WHEN o atendente aciona o Icone_Gestao_Encaminhamentos de uma Linha_De_Vaga, THE Lista_De_Vagas SHALL navegar para `gestao-encaminhamentos.html?vaga=XXXX`, onde `XXXX` é o identificador da Linha_De_Vaga correspondente.

### Requirement 4

**User Story:** Como atendente do IMO, quero uma página de gestão de encaminhamentos com a estrutura visual padrão do sistema, para que a navegação seja consistente com as demais telas.

#### Acceptance Criteria

1. THE Pagina_Gestao_Encaminhamentos SHALL utilizar a estrutura padrão do projeto composta por `govbr-header`, `barra-atendimento-topo`, `app-layout` com `govbr-sidebar` e `main-content`, e `barra-atendimento` como rodapé.
2. THE Pagina_Gestao_Encaminhamentos SHALL aplicar os Tokens_Estilo definidos em `style.css` para manter o padrão visual GOV.BR.
3. THE Pagina_Gestao_Encaminhamentos SHALL carregar o Font Awesome via CDN e os arquivos `style.css` e `app.js`.
4. THE Pagina_Gestao_Encaminhamentos SHALL apresentar o título "Identificação do empregador que oferece a vaga".

### Requirement 5

**User Story:** Como atendente do IMO, quero ver a identificação do empregador que oferece a vaga em um accordion, para que eu confira os dados de contato do empregador.

#### Acceptance Criteria

1. THE Pagina_Gestao_Encaminhamentos SHALL apresentar um accordion intitulado "Identificação do empregador".
2. THE accordion "Identificação do empregador" SHALL exibir o campo "Tipo de identificação" com o valor "CNPJ".
3. THE accordion "Identificação do empregador" SHALL exibir o campo "Número de identificação" com o valor "08.811.226/0019-03".
4. THE accordion "Identificação do empregador" SHALL exibir o campo "Nome de Fantasia" com o valor "CAFE SAO BRAZ".
5. THE accordion "Identificação do empregador" SHALL exibir o campo "Contato" com o valor "Nome".
6. THE accordion "Identificação do empregador" SHALL exibir o campo "Telefone" com o valor "(27) 99999-1234".

### Requirement 6

**User Story:** Como atendente do IMO, quero ver os dados da vaga em um accordion recolhível, para que eu consulte as informações completas da vaga e possa ocultá-las quando necessário.

#### Acceptance Criteria

1. THE Pagina_Gestao_Encaminhamentos SHALL apresentar um accordion intitulado "Dados da vaga" com a ação "Ocultar".
2. WHEN o atendente aciona a ação "Ocultar" do accordion "Dados da vaga", THE Pagina_Gestao_Encaminhamentos SHALL recolher o conteúdo do accordion "Dados da vaga".
3. THE accordion "Dados da vaga" SHALL exibir o campo "Número de identificação" com o valor "99920".
4. THE accordion "Dados da vaga" SHALL exibir o campo "Data de cadastro" com o valor "04/12/2025".
5. THE accordion "Dados da vaga" SHALL exibir o campo "Tipo de intermediação" com o valor "Por ocupação".
6. THE accordion "Dados da vaga" SHALL exibir o campo "Ocupação" com o valor "5134-35 - Atendente de lanchonete".
7. THE accordion "Dados da vaga" SHALL exibir o campo "Contratação" com o valor "Permanente".
8. THE accordion "Dados da vaga" SHALL exibir o campo "Encerrada?" com o valor "Sim".
9. THE accordion "Dados da vaga" SHALL exibir o campo "Status da vaga" com o valor "Prazo de validade expirado".
10. THE accordion "Dados da vaga" SHALL exibir o campo "Direcionamento" com o valor "Indiferente".
11. THE accordion "Dados da vaga" SHALL exibir o campo "Iniciativa" com o valor "Empregador".
12. THE accordion "Dados da vaga" SHALL exibir o campo "Data final prevista para retorno do encaminhamento" com o valor "05/12/2025".
13. THE accordion "Dados da vaga" SHALL exibir o campo "Quantidade de vagas oferecidas" com o valor "3".
14. THE accordion "Dados da vaga" SHALL exibir o campo "Reposição" com o valor "3".
15. THE accordion "Dados da vaga" SHALL exibir o campo "Aumento de quadro" com o valor "0".
16. THE accordion "Dados da vaga" SHALL exibir o campo "Vagas canceladas" com o valor "0".

### Requirement 7

**User Story:** Como atendente do IMO, quero visualizar os encaminhamentos pendentes de retorno da vaga em uma tabela com indicadores por trabalhador, para que eu identifique a situação de cada trabalhador encaminhado.

#### Acceptance Criteria

1. THE Pagina_Gestao_Encaminhamentos SHALL apresentar a Tabela_Encaminhamentos intitulada "Encaminhamentos Pendentes de retorno".
2. THE Tabela_Encaminhamentos SHALL apresentar as colunas de indicadores "Trabalhador não monitorado pelo SD" e "Trabalhador sem curso concluído no PRONATEC", a coluna "PIS/PASEP/NIS/NIT", a coluna "Nome do trabalhador", a coluna "Data" e a coluna de ações.
3. THE coluna de ações da Tabela_Encaminhamentos SHALL apresentar, em cada linha, as ações "Imprimir" e "Registrar o resultado do encaminhamento".
4. THE Tabela_Encaminhamentos SHALL apresentar uma linha de exemplo com "PIS/PASEP/NIS/NIT" igual a "190.18588.38-8", "Nome do trabalhador" igual a "Cicero Joao da Silva" e "Data" igual a "04/12/2025".
5. THE Tabela_Encaminhamentos SHALL apresentar uma linha de exemplo com "PIS/PASEP/NIS/NIT" igual a "214.63337.84-3", "Nome do trabalhador" igual a "Fulano Dtgcpqv Raxduichf" e "Data" igual a "04/12/2025".
6. THE Tabela_Encaminhamentos SHALL apresentar uma linha de exemplo com "PIS/PASEP/NIS/NIT" igual a "567.84565.75-4", "Nome do trabalhador" igual a "Jacy Afonso de Melo" e "Data" igual a "04/12/2025".
7. THE Pagina_Gestao_Encaminhamentos SHALL apresentar um botão "Salvar XLS".
8. THE Pagina_Gestao_Encaminhamentos SHALL apresentar um rodapé de ações com os botões "Encaminhamentos Pendentes de retorno" e "Cancelar".

### Requirement 8

**User Story:** Como atendente do IMO, quero que as ações da página de gestão de encaminhamentos respondam de forma coerente no protótipo, para que eu tenha retorno visual ao acioná-las mesmo sem backend.

#### Acceptance Criteria

1. WHEN o atendente aciona a ação "Imprimir", THE Pagina_Gestao_Encaminhamentos SHALL exibir uma mensagem por meio do Sistema_Toast.
2. WHEN o atendente aciona a ação "Registrar o resultado do encaminhamento", THE Pagina_Gestao_Encaminhamentos SHALL exibir uma mensagem por meio do Sistema_Toast.
3. WHEN o atendente aciona o botão "Salvar XLS", THE Pagina_Gestao_Encaminhamentos SHALL exibir uma mensagem por meio do Sistema_Toast.
4. WHEN o atendente aciona o botão "Encaminhamentos Pendentes de retorno", THE Pagina_Gestao_Encaminhamentos SHALL exibir uma mensagem por meio do Sistema_Toast.
5. WHEN o atendente aciona o botão "Cancelar", THE Pagina_Gestao_Encaminhamentos SHALL navegar para `lista-vagas.html`.
