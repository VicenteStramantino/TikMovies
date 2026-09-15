import type { Movie } from '../data/movies'
import MovieCard from '../components/MovieCard'

type HomePageProps = {
  watched: number[]
  favorites: number[]
  toWatch: number[]
  onToggleWatched: (movie: Movie) => void
  onToggleFavorite: (movie: Movie) => void
  onToggleToWatch: (movie: Movie) => void
  onSelect: (movie: Movie) => void
  movies: Movie[]
}

function HomePage({
  watched,
  favorites,
  toWatch,
  onToggleWatched,
  onToggleFavorite,
  onToggleToWatch,
  onSelect,
  movies,
}: HomePageProps) {
  const hero = movies[0]
  const heroWasWatched = watched.includes(hero.id)
  const heroIsFavorite = favorites.includes(hero.id)
  const heroIsOnWatchlist = toWatch.includes(hero.id)
  const recommendedMovies = movies.slice(1, 5)
  const highestRatedMovies = movies.slice().sort((firstMovie, secondMovie) => secondMovie.rating - firstMovie.rating)

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
              {heroWasWatched ? 'Já assisti' : 'Marcar como assistido'}
            </button>
            <button className="secondary-button" type="button" onClick={() => onToggleFavorite(hero)}>
              <i className={heroIsFavorite ? 'bx bxs-heart' : 'bx bx-heart'} aria-hidden="true" />
              {heroIsFavorite ? 'Favorito' : 'Favoritar'}
            </button>
            <button className="secondary-button" type="button" onClick={() => onToggleToWatch(hero)}>
              <i className={heroIsOnWatchlist ? 'bx bxs-bookmark-plus' : 'bx bx-bookmark-plus'} aria-hidden="true" />
              {heroIsOnWatchlist ? 'Quero assistir' : 'Adicionar à lista'}
            </button>
          </div>
        </div>
      </section>

      <section className="content-section">
        <MovieRow title="Recomendados" movies={recommendedMovies} onSelect={onSelect} />
        <MovieRow title="Mais bem avaliados" movies={highestRatedMovies} onSelect={onSelect} />
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

export default HomePage
