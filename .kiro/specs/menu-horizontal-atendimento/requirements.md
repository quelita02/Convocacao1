# Documento de Requisitos

## Introdução

Esta funcionalidade organiza as ações de atendimento das páginas de atendimento do protótipo IMO GOV.BR em duas barras fixas horizontais. Uma barra superior fixa (sticky), posicionada logo abaixo do cabeçalho GOV.BR, reúne os dois itens de navegação: um atalho para a página inicial do atendimento e uma ação para finalizar o atendimento. Uma barra inferior fixa, posicionada no rodapé, reúne o indicador de duração do atendimento. Ambas as barras permanecem sempre visíveis durante a rolagem. A funcionalidade também inclui a criação de uma nova página de confirmação de logout (`logout.html`) no padrão GOV.BR.

O objetivo é oferecer ao atendente do SINE acesso persistente às ações de navegação no topo e ao indicador de duração no rodapé em todas as telas do fluxo, mantendo a consistência visual com o Design System GOV.BR já utilizado no projeto.

## Glossário

- **Barra_Superior_De_Atendimento**: Componente de interface horizontal, fixo (sticky) na parte superior da janela de visualização logo abaixo do cabeçalho GOV.BR (`govbr-header`), presente nas páginas de atendimento e composto por dois itens de navegação: "Página inicial do atendimento" e "Finalizar o atendimento".
- **Barra_Inferior_De_Atendimento**: Componente de interface horizontal, fixo na parte inferior da janela de visualização, presente nas páginas de atendimento e composto pelo Indicador_De_Duração.
- **Página_De_Atendimento**: Cada uma das páginas HTML que compõem o fluxo de atendimento: `index.html`, `lista-vagas.html`, `detalhes-vaga.html`, `cadastro-trabalhador.html` e `detalhes-batimento.html`.
- **Página_De_Logout**: Nova página `logout.html`, no padrão GOV.BR, que exibe a confirmação "Atendimento finalizado" e um botão com o rótulo "Iniciar novo atendimento" que direciona para a lista de vagas.
- **Modal_De_Confirmacao_Finalizacao**: Modal de confirmação exibido ao acionar "Finalizar o atendimento", que utiliza o mecanismo de modais do projeto (função `openModal` exposta por `app.js`), apresentando a pergunta de confirmação com o nome do empregador e os botões "Sim" e "Não".
- **Nome_Do_Empregador**: Valor estático de exemplo "DIRECAO GERAL BB" apresentado na pergunta do Modal_De_Confirmacao_Finalizacao, fixo no protótipo.
- **Indicador_De_Duração**: Elemento textual da Barra_Inferior_De_Atendimento que exibe o rótulo "Duração do atendimento" seguido do valor estático "00:25".
- **Atendente**: Servidor do SINE que utiliza o protótipo para realizar o atendimento a um empregador.
- **Conteúdo_Principal**: Região `main-content` de cada Página_De_Atendimento, onde o conteúdo rolável da tela é apresentado.

## Requisitos

### Requisito 1

**User Story:** Como atendente do SINE, quero as ações de atendimento organizadas em uma barra fixa no topo e um indicador fixo no rodapé, para acessar a navegação e acompanhar a duração sem perder o contexto ao rolar a página.

#### Critérios de Aceitação

1. THE Barra_Superior_De_Atendimento SHALL ser posicionada de forma fixa (sticky) na parte superior da janela de visualização, logo abaixo do cabeçalho GOV.BR (`govbr-header`).
2. WHILE o Atendente rola o Conteúdo_Principal, THE Barra_Superior_De_Atendimento SHALL permanecer visível na parte superior da janela de visualização.
3. THE Barra_Superior_De_Atendimento SHALL exibir os dois itens de navegação na ordem: "Página inicial do atendimento" e, em seguida, "Finalizar o atendimento".
4. THE Barra_Inferior_De_Atendimento SHALL ser posicionada de forma fixa na parte inferior da janela de visualização.
5. WHILE o Atendente rola o Conteúdo_Principal, THE Barra_Inferior_De_Atendimento SHALL permanecer visível na parte inferior da janela de visualização.
6. THE Barra_Inferior_De_Atendimento SHALL exibir o Indicador_De_Duração.
7. THE Barra_Superior_De_Atendimento SHALL aplicar os tokens de design definidos em `style.css` (por exemplo `--color-surface`, `--color-primary` e as variáveis de espaçamento) para manter consistência com o padrão GOV.BR.
8. THE Barra_Inferior_De_Atendimento SHALL aplicar os tokens de design definidos em `style.css` (por exemplo `--color-surface`, `--color-primary` e as variáveis de espaçamento) para manter consistência com o padrão GOV.BR.

### Requisito 2

**User Story:** Como atendente do SINE, quero um atalho para a página inicial do atendimento, para retornar rapidamente à lista de vagas de qualquer tela.

#### Critérios de Aceitação

1. THE Barra_Superior_De_Atendimento SHALL exibir um elemento com o rótulo "Página inicial do atendimento".
2. WHEN o Atendente aciona o elemento "Página inicial do atendimento", THE Barra_Superior_De_Atendimento SHALL direcionar a navegação para `lista-vagas.html`.

### Requisito 3

**User Story:** Como atendente do SINE, quero uma ação para finalizar o atendimento que solicite confirmação antes de encerrar, para evitar encerramentos acidentais e confirmar o empregador correto.

#### Critérios de Aceitação

1. THE Barra_Superior_De_Atendimento SHALL exibir um elemento com o rótulo "Finalizar o atendimento".
2. WHEN o Atendente aciona o elemento "Finalizar o atendimento", THE Barra_Superior_De_Atendimento SHALL abrir o Modal_De_Confirmacao_Finalizacao por meio da função `openModal` de `app.js`.
3. WHEN o Modal_De_Confirmacao_Finalizacao é aberto, THE Modal_De_Confirmacao_Finalizacao SHALL exibir a pergunta "Deseja realmente finalizar o atendimento ao empregador DIRECAO GERAL BB?" contendo o Nome_Do_Empregador.
4. WHEN o Modal_De_Confirmacao_Finalizacao é aberto, THE Modal_De_Confirmacao_Finalizacao SHALL exibir um botão com o rótulo "Sim" e um botão com o rótulo "Não".
5. WHEN o Atendente aciona o botão "Sim" no Modal_De_Confirmacao_Finalizacao, THE Modal_De_Confirmacao_Finalizacao SHALL direcionar a navegação para `logout.html`.
6. WHEN o Atendente aciona o botão "Não" no Modal_De_Confirmacao_Finalizacao, THE Modal_De_Confirmacao_Finalizacao SHALL ser fechado e o Atendente SHALL permanecer na Página_De_Atendimento atual.

### Requisito 4

**User Story:** Como atendente do SINE, quero visualizar a duração do atendimento no rodapé, para ter referência do tempo de atendimento.

#### Critérios de Aceitação

1. THE Indicador_De_Duração SHALL exibir o rótulo "Duração do atendimento" seguido do valor "00:25".
2. THE Indicador_De_Duração SHALL apresentar o valor "00:25" de forma estática, mantendo o mesmo valor durante toda a exibição da página.

### Requisito 5

**User Story:** Como atendente do SINE, quero uma página de confirmação após finalizar o atendimento, para saber que o atendimento foi encerrado e poder retornar à lista de vagas.

#### Critérios de Aceitação

1. THE Página_De_Logout SHALL ser criada como `logout.html` seguindo o padrão visual GOV.BR do projeto.
2. THE Página_De_Logout SHALL exibir a mensagem de confirmação "Atendimento finalizado".
3. THE Página_De_Logout SHALL exibir um botão com o rótulo "Iniciar novo atendimento".
4. WHEN o Atendente aciona o botão "Iniciar novo atendimento" na Página_De_Logout, THE Página_De_Logout SHALL direcionar a navegação para `lista-vagas.html`.

### Requisito 6

**User Story:** Como atendente do SINE, quero que ambas as barras de atendimento estejam presentes em todas as telas de atendimento, para ter acesso consistente à navegação e à duração em todo o fluxo.

#### Critérios de Aceitação

1. THE Barra_Superior_De_Atendimento SHALL ser exibida em `index.html`, `lista-vagas.html`, `detalhes-vaga.html`, `cadastro-trabalhador.html` e `detalhes-batimento.html`.
2. THE Barra_Inferior_De_Atendimento SHALL ser exibida em `index.html`, `lista-vagas.html`, `detalhes-vaga.html`, `cadastro-trabalhador.html` e `detalhes-batimento.html`.
3. WHERE a Barra_Superior_De_Atendimento é exibida em uma Página_De_Atendimento, THE Conteúdo_Principal SHALL reservar espaçamento superior suficiente para que a Barra_Superior_De_Atendimento não sobreponha o conteúdo rolável.
4. WHERE a Barra_Inferior_De_Atendimento é exibida em uma Página_De_Atendimento, THE Conteúdo_Principal SHALL reservar espaçamento inferior suficiente para que a Barra_Inferior_De_Atendimento não sobreponha o conteúdo rolável.
