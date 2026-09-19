# tikMovies

Aplicação acadêmica desenvolvida em React para ajudar usuários a organizar filmes que já assistiram, querem assistir ou marcaram como favoritos.

Link do Vercel: https://tikmovies.vercel.app/

## Integrantes

- Vicente Stramanantino
- Bianca Vitória Veloso

## Problema

Muitas pessoas esquecem quais filmes já assistiram, quais ainda desejam assistir e onde podem encontrar determinados títulos.

## Solução

O tikMovies permite pesquisar filmes, consultar informações sobre cada título e organizar filmes em três listas pessoais:

- Já assisti;
- Quero assistir;
- Favoritos.

As listas são salvas no navegador do usuário. A aplicação também mostra recomendações baseadas nos filmes salvos e informações de disponibilidade para assistir no Brasil.

## Funcionalidades

- Pesquisa de filmes em tempo real;
- Filtro por gênero;
- Exibição do ano de lançamento;
- Página com detalhes do filme;
- Informações de nota, descrição, orçamento, produtores e plataformas de streaming;
- Listas de filmes salvas localmente;
- Recomendações baseadas nas listas do usuário;
- Navegação entre páginas usando React Router;
- Interface em modo escuro;
- Mensagens de carregamento e erro durante as consultas à API.

## Tecnologias utilizadas

- React;
- TypeScript;
- Vite;
- React Router;
- CSS;
- Boxicons;
- API do TMDB;
- LocalStorage do navegador.

## API utilizada

O projeto utiliza a [API do TMDB](https://www.themoviedb.org/documentation/api) para buscar filmes, gêneros, detalhes e informações sobre plataformas de streaming.

A chave da API não deve ser colocada diretamente no código. Ela deve ficar em um arquivo `.env` na raiz do projeto:

```env
VITE_TMDB_API_TOKEN=sua_chave_da_api
```

Depois de criar ou alterar o arquivo `.env`, é necessário reiniciar o servidor do Vite.

## Como executar o projeto

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar a chave da API

Crie o arquivo `.env` na raiz do projeto e adicione:

```env
VITE_TMDB_API_TOKEN=sua_chave_da_api
```

### 3. Iniciar o projeto

```bash
npm run dev
```

Depois, acesse o endereço mostrado no terminal, normalmente `http://localhost:5173`.

## Rotas principais

| Rota | Descrição |
|---|---|
| `/` | Página inicial com destaque e recomendações |
| `/explorar` | Pesquisa e filtros de filmes |
| `/listas` | Listas pessoais do usuário |
| `/filme/:id` | Detalhes de um filme específico |

## Organização do projeto

```text
src/
├── components/   Componentes reutilizáveis
├── data/         Dados fixos da aplicação
├── models/       Tipos utilizados no projeto
├── pages/        Páginas das rotas
├── services/     Comunicação com a API do TMDB
├── App.tsx       Estado principal e estrutura da aplicação
└── main.tsx      Configuração das rotas e inicialização do React
```

## Uso de inteligência artificial

A inteligência artificial foi utilizada como apoio durante o desenvolvimento para:

- Tirar dúvidas sobre React, TypeScript e CSS;
- Ajudar na organização dos componentes;
- Sugerir melhorias de estrutura e legibilidade;
- Auxiliar na integração com a API do TMDB;
- Revisar possíveis erros no código.

As decisões sobre as funcionalidades, o visual e a organização final do projeto foram feitas pelo grupo. O código deve ser revisado e compreendido pelos integrantes antes da entrega.

## Comandos disponíveis

```bash
npm i
npm run dev
```