import type { Movie } from '../../../data/movies'
import MovieCard from '../../MovieCard/MovieCard'
import './HomeScreen.css'

type HomeScreenProps = {
  watched: number[]
  favorites: number[]
  onToggleWatched: (movie: Movie) => void
  onToggleFavorite: (movie: Movie) => void
  onSelect: (movie: Movie) => void
  movies: Movie[]
}

function HomeScreen({
  watched,
  favorites,
  onToggleWatched,
  onToggleFavorite,
  onSelect,
  movies,
}: HomeScreenProps) {
  const hero = movies[0]

  return (
    <div>
      <section className="hero" style={{ backgroundImage: `url(${hero.backdrop})` }}>
        <div className="hero-content">
          <p className="eyebrow">Filme em destaque</p>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => onToggleWatched(hero)}>
              <i className="bx bx-show" aria-hidden="true" />
              {watched.includes(hero.id) ? 'Já assisti' : 'Marcar como assistido'}
            </button>
            <button className="secondary-button" type="button" onClick={() => onToggleFavorite(hero)}>
              <i className={favorites.includes(hero.id) ? 'bx bxs-heart' : 'bx bx-heart'} aria-hidden="true" />
              {favorites.includes(hero.id) ? 'Favorito' : 'Favoritar'}
            </button>
          </div>
        </div>
      </section>

      <section className="content-section">
        <MovieRow title="Recomendados" movies={movies.slice(1, 5)} onSelect={onSelect} />
        <MovieRow title="Mais bem avaliados" movies={movies.slice().sort((a, b) => b.rating - a.rating)} onSelect={onSelect} />
      </section>
    </div>
  )
}

type MovieRowProps = {
  title: string
  movies: Movie[]
  onSelect: (movie: Movie) => void
}

function MovieRow({ title, movies, onSelect }: MovieRowProps) {
  return (
    <section className="movie-row" aria-label={title}>
      <h2>{title}</h2>
      <div className="movie-row-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}

export default HomeScreen
