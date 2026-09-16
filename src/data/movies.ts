export type ResumoFilme = {
  id: number
  titulo: string
  anoLancamento: number
  idsGeneros: number[]
  poster: string
}

export type Filme = ResumoFilme & {
  avaliacao: number
  generos: string[]
  descricao: string
  fundo: string
  plataformas: string[]
  orcamento: number
  produtores: string[]
}

export type FilmeSalvo = ResumoFilme

export const generos = [
  { id: 0, nome: 'Todos' },
  { id: 28, nome: 'Ação' },
  { id: 12, nome: 'Aventura' },
  { id: 16, nome: 'Animação' },
  { id: 35, nome: 'Comédia' },
  { id: 18, nome: 'Drama' },
  { id: 878, nome: 'Ficção científica' },
  { id: 27, nome: 'Terror' },
]
