# Requirements — tikMovies

## 1. Visão do Produto

### Nome
tikMovies

### Problema
Usuários casuais e cinéfilos frequentemente esquecem os filmes que já assistiram, perdem de vista as obras que têm interesse em ver, ou têm dificuldade em se lembrar de títulos específicos para recomendar a amigos. Além disso, existe a frustração constante de não saber rapidamente em qual plataforma de streaming um filme está disponível no Brasil.

### Público
Cinéfilos, pessoas interessadas em cultura pop e usuários casuais que gostam de organizar, catalogar e recomendar filmes.

### Proposta de solução
Um sistema front-end focado no gerenciamento pessoal de filmes. A aplicação não atua como player, mas como um guia definitivo onde o usuário cataloga o que já viu, o que quer ver e seus favoritos, recebendo em troca recomendações baseadas no seu gosto e a informação exata de onde cada filme está disponível para streaming no Brasil.

## 2. Objetivo do MVP
Entregar uma aplicação front-end funcional, estritamente em modo escuro, que se integre à API do TMDB. O MVP deve permitir ao usuário pesquisar filmes, visualizar detalhes e disponibilidade de streaming, além de gerenciar três listas independentes ("Já Assisti", "Quero Assistir", "Favoritos") armazenadas localmente, entregando também recomendações personalizadas com base nesse histórico.

## 3. Funcionalidades

### F01 — Gerenciamento da Minha Lista
**Descrição:** Permite ao usuário organizar filmes nas categorias "Já Assisti", "Quero Assistir" e "Favoritos", mantendo os dados salvos localmente no navegador.

**Critérios de aceitação:**
- [x] Nenhuma ação de listagem deve exigir backend próprio; todos os dados (`id`, `title`, `poster_path`, `ano` e `genre_ids`) devem ser salvos no `LocalStorage`.
- [x] Se um filme de "Quero Assistir" for marcado como "Já Assisti" (e vice-versa), ele deve ser removido da lista anterior automaticamente.
- [x] O status de "Favorito" é totalmente independente, podendo coexistir simultaneamente com os demais status.
- [x] Os cards exibidos na aba "Minha Lista" devem conter estritamente: Nome, Pôster e Ano de Lançamento.
- [x] A aba "Minha Lista" não deve realizar requisições N+1 para a API; ela deve carregar instantaneamente na montagem usando os dados locais.

**Estados:**
- [x] Inicial (Carregamento instantâneo)
- [ ] Carregando (Não se aplica, carrega localmente)
- [x] Sucesso (Listas exibidas corretamente)
- [x] Vazio (Exibir centralizado: "Sua lista está vazia" se a aba selecionada não tiver filmes)
- [x] Erro (Falha ao ler/escrever no LocalStorage)

### F02 — Busca em Tempo Real e Filtros
**Descrição:** Mecanismo de busca localizado no Header, associado a filtros de categorias e décadas na página Explorar.

**Critérios de aceitação:**
- [x] A barra de pesquisa (Header) deve reagir em tempo real à digitação.
- [x] Clicar na barra deve redirecionar instantaneamente para `/explorar` com o foco retido no input.
- [x] É permitido o cruzamento de filtros (Nome + Gênero, Nome + Década, etc.).
- [x] O ano de lançamento deve ser exibido nos cards e nos detalhes dos filmes.
- [x] Ao combinar filtros, o *Infinite Scroll* deve ser desligado e substituído por um botão "Carregar mais".

**Estados:**
- [x] Inicial (Sem filtros aplicados)
- [x] Carregando (Buscando resultados na API)
- [x] Sucesso (Grid de filmes populado)
- [x] Vazio (Nenhum filme encontrado para os critérios informados)
- [x] Erro (Falha de comunicação com o servidor/API)

### F03 — Detalhes do Filme e Disponibilidade
**Descrição:** Tela com informações aprofundadas sobre o filme e os provedores que o transmitem.

**Critérios de aceitação:**
- [x] A página `/filme/:id` deve exibir: nota, descrição, lançamento, orçamento, produtores e onde assistir.
- [x] O guia "Onde assistir" deve considerar apenas a região "BR" e apenas serviços de *Streaming* por assinatura (ignorar compra e aluguel).
- [x] Se não houver opção em streaming, exibir especificamente a mensagem: "Não disponível para streaming no Brasil".

**Estados:**
- [x] Inicial
- [x] Carregando (Carregando detalhes via API)
- [x] Sucesso (Página completamente montada)
- [ ] Vazio 
- [x] Erro (ID não encontrado ou erro de API)

### F04 — Home: Destaque e Recomendações
**Descrição:** Tela inicial contendo um filme hero e trilhas sugeridas com base no comportamento do usuário.

**Critérios de aceitação:**
- [x] O filme em destaque ("Hero") deve ser sorteado entre os Top 20 atuais da API.
- [x] Caso o filme "Hero" sorteado já conste na lista de "Já Assisti" do usuário, outro deve ser sorteado no lugar.
- [x] A seção "Recomendado para você" deve observar os `genre_ids`. Prioridade 1: Gênero mais comum em "Favoritos". Prioridade 2: Gênero mais comum em "Já Assisti". 
- [x] Em caso de empate, buscar filmes com ambos os gêneros. Se não houver, usar apenas o primeiro gênero do empate.

**Estados:**
- [x] Inicial
- [x] Carregando (Carregando Hero e tendências)
- [x] Sucesso (Home populada)
- [x] Vazio (Ocultar a seção de recomendações se ambas as listas estiverem vazias)
- [x] Erro (Falha ao carregar API na Home)

## 4. Fora do Escopo

- Criação de um Backend próprio ou Banco de Dados na nuvem.
- Sistema de Login, Autenticação de Usuários ou recuperação de senha.
- Reprodutor de vídeo nativo na aplicação (streaming do filme diretamente pelo app).
- Exibição de plataformas de aluguel ou compra avulsa de filmes.
- Implementação de um Tema Claro (Light Mode)
