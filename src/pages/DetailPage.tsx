import type { Movie } from '../data/movies'

type DetailPageProps = {
  movie: Movie
  watched: number[]
  favorites: number[]
  toWatch: number[]
  onToggleWatched: (movie: Movie) => void
  onToggleFavorite: (movie: Movie) => void
  onToggleToWatch: (movie: Movie) => void
  onBack: () => void
}

type DetailAction = {
  icon: string
  activeIcon: string
  activeLabel: string
  inactiveLabel: string
  isActive: boolean
  onClick: () => void
}

function DetailPage({ movie, watched, favorites, toWatch, onToggleWatched, onToggleFavorite, onToggleToWatch, onBack }: DetailPageProps) {
  const actions: DetailAction[] = [
    {
      icon: 'bx-show',
      activeIcon: 'bx-show',
      activeLabel: 'Assistido',
      inactiveLabel: 'Assistir',
      isActive: watched.includes(movie.id),
      onClick: () => onToggleWatched(movie),
    },
    {
      icon: 'bx-heart',
      activeIcon: 'bxs-heart',
      activeLabel: 'Favorito',
      inactiveLabel: 'Favoritar',
      isActive: favorites.includes(movie.id),
      onClick: () => onToggleFavorite(movie),
    },
    {
      icon: 'bx-bookmark-plus',
      activeIcon: 'bxs-bookmark-plus',
      activeLabel: 'Na lista',
      inactiveLabel: 'Quero assistir',
      isActive: toWatch.includes(movie.id),
      onClick: () => onToggleToWatch(movie),
    },
  ]

  return (
    <section className="detail-page">
      <div className="detail-backdrop" aria-hidden="true" style={{ backgroundImage: `url(${movie.backdrop})` }} />
      <div className="detail-content">
        <button className="back-button" type="button" onClick={onBack}>
          <i className="bx bx-arrow-back" aria-hidden="true" /> Voltar
        </button>
        <div className="detail-layout">
          <div className="poster-column">
            <img className="detail-poster" src={movie.poster} alt={`Capa do filme ${movie.title}`} />
            <div className="detail-actions">
              {actions.map((action) => (
                <button className="detail-action" type="button" onClick={action.onClick} key={action.activeLabel}>
                  <i className={`bx ${action.isActive ? action.activeIcon : action.icon}`} aria-hidden="true" />
                  <span>{action.isActive ? action.activeLabel : action.inactiveLabel}</span>
                </button>
              ))}
            </div>
          </div>

          <section className="detail-info" aria-labelledby="movie-title">
            <ul className="genre-list" aria-label="Gêneros">
              {movie.genres.map((genre) => <li key={genre}>{genre}</li>)}
            </ul>
            <h1 id="movie-title">{movie.title}</h1>
            <p className="movie-meta">{movie.year} <span>•</span> <strong>★ {movie.rating}</strong></p>
            <p className="detail-description">{movie.description}</p>

            <ul className="movie-details" aria-label="Informações do filme">
              <li>
                <strong className="movie-detail-label">Data de lançamento</strong>
                <span className="movie-detail-value">{movie.year}</span>
              </li>
              <li>
                <strong className="movie-detail-label">Avaliação</strong>
                <span className="movie-detail-value cyan-text">{movie.rating} / 10</span>
              </li>
              <li>
                <strong className="movie-detail-label">Gêneros</strong>
                <span className="movie-detail-value">{movie.genres.join(', ')}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  )
}

export default DetailPage
