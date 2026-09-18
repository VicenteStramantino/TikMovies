export type FilmeDaApi = {
  id: number
  title: string
  release_date?: string
  vote_average?: number
  genre_ids?: number[]
  genres?: GeneroDaApi[]
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  budget?: number
  credits?: {
    crew?: PessoaDaEquipeApi[]
  }
  'watch/providers'?: {
    results?: {
      BR?: {
        flatrate?: PlataformaDaApi[]
      }
    }
  }
}

export type GeneroDaApi = {
  id: number
  name: string
}

export type PessoaDaEquipeApi = {
  job: string
  name: string
}

export type PlataformaDaApi = {
  provider_id: number
  provider_name: string
}

export type RespostaListaDaApi = {
  results: FilmeDaApi[]
  total_pages: number
}

export type RespostaGenerosDaApi = {
  genres: GeneroDaApi[]
}
