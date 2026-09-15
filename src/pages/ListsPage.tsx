import { useState } from 'react'
import type { Movie } from '../data/movies'
import MovieCard from '../components/MovieCard'

type ListsPageProps = {
  movies: Movie[]
  watched: number[]
  favorites: number[]
  toWatch: number[]
  onToggleWatched: (movie: Movie) => void
  onToggleFavorite: (movie: Movie) => void
  onToggleToWatch: (movie: Movie) => void
  onSelect: (movie: Movie) => void
}

const tabs = [
  { key: 'watched', label: 'Assistidos', icon: 'bx-show' },
  { key: 'favorites', label: 'Favoritos', icon: 'bx-heart' },
  { key: 'toWatch', label: 'Quero assistir', icon: 'bx-bookmark-plus' },
] as const

function ListsPage({ movies, watched, favorites, toWatch, onToggleWatched, onToggleFavorite, onToggleToWatch, onSelect }: ListsPageProps) {
  const [activeTab, setActiveTab] = useState<'watched' | 'favorites' | 'toWatch'>('watched')
  const lists = { watched, favorites, toWatch }
  const activeList = lists[activeTab]
  const moviesInList = movies.filter((movie) => activeList.includes(movie.id))
  const removeHandlers = { watched: onToggleWatched, favorites: onToggleFavorite, toWatch: onToggleToWatch }

  return (
    <section className="page-content">
      <p className="eyebrow">Sua coleção</p>
      <h1>Minhas listas</h1>
      <div className="tabs" role="group" aria-label="Minhas listas">
        {tabs.map((tab) => (
          <button
            className={`tab ${tab.key === 'favorites' ? 'favorite' : ''} ${activeTab === tab.key ? 'active' : ''}`}
            key={tab.key}
            type="button"
            aria-pressed={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`bx ${tab.icon}`} aria-hidden="true" /> {tab.label} ({lists[tab.key].length})
          </button>
        ))}
      </div>

      {moviesInList.length > 0 ? (
        <section className="movie-grid" aria-label={activeTab === 'watched' ? 'Filmes assistidos' : activeTab === 'favorites' ? 'Filmes favoritos' : 'Filmes na lista de quero assistir'}>
          {moviesInList.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelect}
              onRemove={() => removeHandlers[activeTab](movie)}
            />
          ))}
        </section>
      ) : (
        <p className="empty-message">Sua lista ainda está vazia.</p>
      )}
    </section>
  )
}

export default ListsPage
