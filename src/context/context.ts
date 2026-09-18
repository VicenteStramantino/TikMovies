import { createContext } from 'react'
import type { Filme, FilmeSalvo } from '../models/movie'

export type TipoLista = 'assistidos' | 'favoritos' | 'queroAssistir'

export type ContextoDaAplicacao = {
  busca: string
  definirBusca: (texto: string) => void
  generoSelecionado: number
  definirGeneroSelecionado: (idGenero: number) => void
  assistidos: FilmeSalvo[]
  favoritos: FilmeSalvo[]
  queroAssistir: FilmeSalvo[]
  filmesInicio: Filme[]
  filmesRecomendados: Filme[]
  filmesExplorar: Filme[]
  carregandoInicio: boolean
  erroInicio: boolean
  carregandoExplorar: boolean
  erroExplorar: boolean
  temMais: boolean
  alternarFilme: (filme: FilmeSalvo, tipo: TipoLista) => void
  carregarMaisFilmes: () => Promise<void>
}

export const ContextoAplicacao = createContext<ContextoDaAplicacao | undefined>(undefined)
