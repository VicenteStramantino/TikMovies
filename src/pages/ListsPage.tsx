import { useState } from 'react'
import type { FilmeSalvo } from '../data/movies'
import MovieCard from '../components/MovieCard'

type TipoLista = 'watched' | 'favorites' | 'toWatch'
type PropriedadesListas = {
  assistidos: FilmeSalvo[]
  favoritos: FilmeSalvo[]
  queroAssistir: FilmeSalvo[]
  aoAlternarAssistido: (filme: FilmeSalvo) => void
  aoAlternarFavorito: (filme: FilmeSalvo) => void
  aoAlternarQueroAssistir: (filme: FilmeSalvo) => void
  aoSelecionar: (filme: FilmeSalvo) => void
}

const abas = [
  { chave: 'watched', nome: 'Assistidos', icone: 'bx-show' },
  { chave: 'favorites', nome: 'Favoritos', icone: 'bx-heart' },
  { chave: 'toWatch', nome: 'Quero assistir', icone: 'bx-bookmark-plus' },
] as const

function ListsPage({ assistidos, favoritos, queroAssistir, aoAlternarAssistido, aoAlternarFavorito, aoAlternarQueroAssistir, aoSelecionar }: PropriedadesListas) {
  const [abaAtiva, definirAbaAtiva] = useState<TipoLista>('watched')
  const listas = { watched: assistidos, favorites: favoritos, toWatch: queroAssistir }
  const listaAtiva = listas[abaAtiva]
  const aoRemover = { watched: aoAlternarAssistido, favorites: aoAlternarFavorito, toWatch: aoAlternarQueroAssistir }

  return (
    <section className="page-content">
      <p className="eyebrow">Sua coleção</p>
      <h1>Minhas listas</h1>
      <div className="tabs" role="group" aria-label="Minhas listas">
        {abas.map((aba) => <button className={`tab ${aba.chave === 'favorites' ? 'favorite' : ''} ${abaAtiva === aba.chave ? 'active' : ''}`} key={aba.chave} type="button" aria-pressed={abaAtiva === aba.chave} onClick={() => definirAbaAtiva(aba.chave)}><i className={`bx ${aba.icone}`} aria-hidden="true" /> {aba.nome} ({listas[aba.chave].length})</button>)}
      </div>

      {listaAtiva.length > 0 ? <section className="movie-grid" aria-label="Filmes da lista selecionada">
        {listaAtiva.map((filme) => <MovieCard key={filme.id} filme={filme} aoSelecionar={aoSelecionar} aoRemover={() => aoRemover[abaAtiva](filme)} />)}
      </section> : <p className="empty-message">Sua lista está vazia</p>}
    </section>
  )
}

export default ListsPage
