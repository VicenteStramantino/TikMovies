# Requirements — tikMovies

## 1. Visão do Produto

### Nome

tikMovies

### Problema

Usuários podem esquecer quais filmes já assistiram, quais desejam assistir e onde podem encontrar um determinado filme.

### Público

Cinéfilos, pessoas interessadas em cultura pop e usuários que desejam organizar seus filmes de forma simples.

### Proposta de solução

O tikMovies permite pesquisar filmes, consultar seus detalhes, verificar plataformas de streaming no Brasil e organizar títulos em listas pessoais.

## 2. Objetivo do MVP

Criar uma aplicação front-end em React integrada à API do TMDB. O usuário deve conseguir pesquisar filmes, visualizar seus detalhes e salvar títulos nas listas “Já assisti”, “Quero assistir” e “Favoritos”.

## 3. Funcionalidades

### F01 — Gerenciamento das listas

**Descrição:** Permitir que o usuário adicione e remova filmes das listas pessoais.

**Critérios de aceitação:**

- [x] Exibir as listas “Já assisti”, “Quero assistir” e “Favoritos”.
- [x] Salvar as listas no LocalStorage do navegador.
- [x] Permitir que um filme seja favorito e também esteja em outra lista.
- [x] Remover um filme da lista anterior ao marcá-lo como assistido ou como quero assistir.
- [x] Exibir o nome, o pôster e o ano de lançamento nos cards das listas.
- [x] Mostrar uma mensagem quando a lista selecionada estiver vazia.

**Estados:**

- [x] Inicial: listas carregadas do navegador.
- [x] Sucesso: filmes exibidos na lista selecionada.
- [x] Vazio: nenhuma mensagem de filme na lista selecionada.

### F02 — Pesquisa e filtro por gênero

**Descrição:** Permitir que o usuário pesquise filmes e filtre os resultados por gênero.

**Critérios de aceitação:**

- [x] A pesquisa deve ser feita pelo campo do cabeçalho.
- [x] Ao clicar no campo de pesquisa, o usuário deve ser levado para a página Explorar.
- [x] Permitir o filtro por gênero.
- [x] Exibir o ano de lançamento nos cards.
- [x] Permitir carregar mais resultados quando existirem novas páginas.

**Estados:**

- [x] Inicial: filmes populares exibidos.
- [x] Carregando: consulta sendo feita na API.
- [x] Sucesso: resultados exibidos.
- [x] Vazio: nenhum filme encontrado.
- [x] Erro: falha na comunicação com a API.

### F03 — Detalhes do filme

**Descrição:** Exibir informações completas de um filme selecionado.

**Critérios de aceitação:**

- [x] A rota `/filme/:id` deve abrir os detalhes do filme.
- [x] Exibir nota, descrição, data de lançamento, orçamento e produtores.
- [x] Exibir plataformas de streaming disponíveis no Brasil.
- [x] Exibir a mensagem “Não disponível para streaming no Brasil” quando necessário.

**Estados:**

- [x] Inicial: página sendo aberta.
- [x] Carregando: detalhes sendo consultados na API.
- [x] Sucesso: informações do filme exibidas.
- [x] Erro: filme não encontrado ou falha na API.

### F04 — Página inicial e recomendações

**Descrição:** Exibir um filme em destaque e recomendações baseadas nas listas do usuário.

**Critérios de aceitação:**

- [x] Escolher um filme em destaque entre os filmes mais avaliados.
- [x] Evitar destacar filmes que já estejam na lista “Já assisti”.
- [x] Buscar recomendações usando os gêneros dos filmes salvos.
- [x] Ocultar as recomendações quando o usuário ainda não possuir filmes nas listas.

**Estados:**

- [x] Carregando: filmes sendo consultados na API.
- [x] Sucesso: destaque e recomendações exibidos.
- [x] Vazio: recomendações ocultadas quando não há histórico.
- [x] Erro: falha ao carregar os filmes.

## 4. Fora do escopo

- Backend próprio;
- Banco de dados na nuvem;
- Login ou autenticação;
- Reprodução dos filmes dentro da aplicação;
- Plataformas de aluguel ou compra;
- Filtro por décadas;
- Tema claro;
- Sistema de notificações.
