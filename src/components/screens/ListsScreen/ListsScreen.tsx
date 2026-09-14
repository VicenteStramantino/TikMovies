import { useState } from 'react'
import type { Movie } from '../../../data/movies'
import MovieCard from '../../MovieCard/MovieCard'
import './ListsScreen.css'

type ListsScreenProps = {
  movies: Movie[]
  watched: number[]
  favorites: number[]
  onToggleWatched: (movie: Movie) => void
  onToggleFavorite: (movie: Movie) => void
  onSelect: (movie: Movie) => void
}

function ListsScreen({ movies, watched, favorites, onToggleWatched, onToggleFavorite, onSelect }: ListsScreenProps) {
  const [activeTab, setActiveTab] = useState<'watched' | 'favorites'>('watched')
  const ids = activeTab === 'watched' ? watched : favorites
  const list = movies.filter((movie) => ids.includes(movie.id))

  return (
    <section className="page-content">
      <p className="eyebrow">Sua coleção</p>
      <h1>Minhas listas</h1>
      <div className="tabs" role="group" aria-label="Minhas listas">
        <button className={activeTab === 'watched' ? 'tab active' : 'tab'} type="button" aria-pressed={activeTab === 'watched'} onClick={() => setActiveTab('watched')}>
          <i className="bx bx-show" aria-hidden="true" /> Assistidos ({watched.length})
        </button>
        <button className={activeTab === 'favorites' ? 'tab favorite active' : 'tab favorite'} type="button" aria-pressed={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')}>
          <i className="bx bx-heart" aria-hidden="true" /> Favoritos ({favorites.length})
        </button>
      </div>

      {list.length > 0 ? (
        <section className="movie-grid" aria-label={activeTab === 'watched' ? 'Filmes assistidos' : 'Filmes favoritos'}>
          {list.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelect}
              onRemove={() => activeTab === 'watched' ? onToggleWatched(movie) : onToggleFavorite(movie)}
            />
          ))}
        </section>
      ) : (
        <p className="empty-message">Sua lista ainda está vazia.</p>
      )}
    </section>
  )
}

export default ListsScreen
