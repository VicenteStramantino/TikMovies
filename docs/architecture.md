# Architecture — tikMovies

## 1. Visão geral

O tikMovies é uma aplicação front-end feita com React e TypeScript. A aplicação utiliza componentes, páginas e React Router para organizar a navegação.

O componente principal fica em `App.tsx`. Ele controla os estados gerais, realiza chamadas para a API do TMDB e compartilha os dados com as páginas por meio das rotas aninhadas.

As listas do usuário são salvas no LocalStorage. Dessa forma, o projeto não precisa de um backend próprio.

## 2. Estrutura de pastas

```text
src/
├── components/
│   ├── Header.tsx
│   └── MovieCard.tsx
├── data/
│   └── genres.ts
├── models/
│   ├── movie.ts
│   └── tmdb.ts
├── pages/
│   ├── DetailPage.tsx
│   ├── ExplorePage.tsx
│   ├── HomePage.tsx
│   └── ListsPage.tsx
├── services/
│   └── tmdb.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## 3. Páginas e rotas

| Página | Rota | Objetivo |
|---|---|---|
| Página inicial | `/` | Mostrar o filme em destaque e as recomendações |
| Explorar | `/explorar` | Pesquisar e filtrar filmes por gênero |
| Minhas listas | `/listas` | Exibir os filmes salvos pelo usuário |
| Detalhes do filme | `/filme/:id` | Mostrar informações de um filme específico |
| Página não encontrada | rota de erro | Informar quando uma página não existe |

## 4. Componentes

| Componente | Responsabilidade | Principais props |
|---|---|---|
| `Header` | Exibir o logo, a pesquisa e os links de navegação | Texto da busca e função para alterá-la |
| `MovieCard` | Exibir o pôster, nome e ano do filme | Filme, status das listas e funções dos botões |
| `HomePage` | Exibir destaque e recomendações | Filmes, listas e funções de alteração |
| `ExplorePage` | Exibir resultados e filtro de gênero | Filmes, busca, gênero, carregamento e funções |
| `ListsPage` | Exibir as três listas do usuário | Listas e funções de alteração |
| `DetailPage` | Exibir os detalhes e plataformas do filme | Filme e funções dos botões |

## 5. Estado da aplicação

| Estado | Onde é controlado? | Motivo |
|---|---|---|
| Texto da busca | `App.tsx` | É usado pelo cabeçalho e pela página Explorar |
| Gênero selecionado | `App.tsx` | Controla o filtro dos resultados |
| Filmes das listas | `App.tsx` | Pode ser usado na Home, Explorar e Detalhes |
| Filmes da página inicial | `App.tsx` | Armazena os filmes obtidos da API |
| Filmes da página Explorar | `App.tsx` | Permite pesquisa e carregamento de páginas |
| Filme em detalhes | `App.tsx` | É carregado pelo identificador da rota |
| Aba selecionada nas listas | `ListsPage.tsx` | É uma interação exclusiva da página de listas |

## 6. `useEffect`

| Efeito | Quando acontece? | O que faz? |
|---|---|---|
| Carregar listas | Ao iniciar a aplicação | Lê os filmes salvos no LocalStorage |
| Salvar listas | Quando uma lista é alterada | Atualiza os dados no LocalStorage |
| Carregar filmes iniciais | Ao iniciar a aplicação | Busca filmes na API do TMDB |
| Pesquisar filmes | Quando a busca ou o gênero muda | Atualiza os resultados da página Explorar |
| Carregar detalhes | Quando o id da rota muda | Busca os detalhes do filme selecionado |
| Controlar destaque | Quando os filmes da Home mudam | Escolhe um filme para a área de destaque |
| Detectar rolagem | Enquanto o usuário rola a página Explorar | Verifica se é necessário buscar mais filmes |

## 7. Dependências

| Biblioteca | Uso | Motivo |
|---|---|---|
| React | Construção da interface | Biblioteca principal do projeto |
| React DOM | Renderização da aplicação | Exibe o React no navegador |
| React Router | Navegação entre páginas | Cria rotas e rotas dinâmicas |
| Boxicons | Ícones da interface | Facilita a utilização de ícones |
| Vite | Servidor e build | Executa e prepara o projeto |
| TypeScript | Tipagem do código | Organiza os dados e propriedades |
| TMDB API | Dados dos filmes | Fornece filmes, detalhes e plataformas |
