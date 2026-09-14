import type { Movie } from '../../../data/movies'
import './DetailScreen.css'

type DetailScreenProps = {
  movie: Movie
  watched: number[]
  favorites: number[]
  onToggleWatched: (movie: Movie) => void
  onToggleFavorite: (movie: Movie) => void
  onBack: () => void
}

function DetailScreen({ movie, watched, favorites, onToggleWatched, onToggleFavorite, onBack }: DetailScreenProps) {
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
              <button className="detail-action" type="button" onClick={() => onToggleWatched(movie)}>
                <i className="bx bx-show" aria-hidden="true" />
                <span>{watched.includes(movie.id) ? 'Assistido' : 'Assistir'}</span>
              </button>
              <button className="detail-action" type="button" onClick={() => onToggleFavorite(movie)}>
                <i className={favorites.includes(movie.id) ? 'bx bxs-heart' : 'bx bx-heart'} aria-hidden="true" />
                <span>{favorites.includes(movie.id) ? 'Favorito' : 'Favoritar'}</span>
              </button>
            </div>
          </div>

          <section className="detail-info" aria-labelledby="movie-title">
            <ul className="genre-list" aria-label="Gêneros">
              {movie.genres.map((genre) => <li key={genre}>{genre}</li>)}
            </ul>
            <h1 id="movie-title">{movie.title}</h1>
            <p className="movie-meta">{movie.year} <span>•</span> <strong>★ {movie.rating}</strong></p>
            <p className="detail-description">{movie.description}</p>

            <dl className="movie-details">
              <div>
                <dt>Data de lançamento</dt>
                <dd>{movie.year}</dd>
              </div>
              <div>
                <dt>Avaliação</dt>
                <dd className="cyan-text">{movie.rating} / 10</dd>
              </div>
              <div>
                <dt>Gêneros</dt>
                <dd>{movie.genres.join(', ')}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </section>
  )
}

export default DetailScreen
