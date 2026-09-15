import type { Movie } from '../data/movies'

type MovieCardProps = {
  movie: Movie
  onSelect: (movie: Movie) => void
  onRemove?: () => void
}

function MovieCard({ movie, onSelect, onRemove }: MovieCardProps) {
  return (
    <article className="movie-card">
      <button className="movie-card-button" type="button" onClick={() => onSelect(movie)}>
        <div className="poster-container">
          <img src={movie.poster} alt={`Capa do filme ${movie.title}`} className="movie-poster" />
        </div>
        <div className="movie-card-info">
          <h3>{movie.title}</h3>
          <p>{movie.year} · {movie.rating}</p>
        </div>
      </button>
      {onRemove && (
        <button
          className="remove-button"
          type="button"
          aria-label={`Remover ${movie.title}`}
          onClick={onRemove}
        >
          <i className="bx bx-x" aria-hidden="true" />
        </button>
      )}
    </article>
  )
}

export default MovieCard
