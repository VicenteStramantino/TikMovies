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
