import { useState } from 'react'
import type { Movie } from '../data/movies'
import { decades, genres } from '../data/movies'
import MovieCard from '../components/MovieCard'

type ExplorePageProps = {
  movies: Movie[]
  searchQuery: string
  onSelect: (movie: Movie) => void
}

function ExplorePage({ movies, searchQuery, onSelect }: ExplorePageProps) {
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [selectedDecade, setSelectedDecade] = useState('Todas')
  const normalizedQuery = searchQuery.toLowerCase()

  const filteredMovies = movies.filter((movie) => matchesFilters(movie, selectedGenre, selectedDecade, normalizedQuery))

  return (
    <section className="page-content">
      <p className="eyebrow">Catálogo</p>
      <h1>Explorar filmes</h1>

      <div className="filters">
        <fieldset>
          <legend>Gênero</legend>
          <div className="filter-buttons">
            {genres.map((genre) => (
              <button className={getFilterClassName(selectedGenre === genre)} key={genre} type="button" onClick={() => setSelectedGenre(genre)}>
                {genre}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Década</legend>
          <div className="filter-buttons">
            {decades.map((decade) => (
              <button className={`${getFilterClassName(selectedDecade === decade)} red`} key={decade} type="button" onClick={() => setSelectedDecade(decade)}>
                {decade}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="result-count">{filteredMovies.length} filmes encontrados</p>
      <section className="movie-grid" aria-label="Filmes encontrados">
        {filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />)}
      </section>
      {filteredMovies.length === 0 && <p className="empty-message">Nenhum filme encontrado.</p>}
    </section>
  )
}

function matchesFilters(movie: Movie, genre: string, decade: string, query: string) {
  const matchesGenre = genre === 'Todos' || movie.genres.includes(genre)
  const matchesDecade = decade === 'Todas' || movie.decade === decade
  const matchesSearch = movie.title.toLowerCase().includes(query) || movie.genres.some((movieGenre) => movieGenre.toLowerCase().includes(query))

  return matchesGenre && matchesDecade && matchesSearch
}

function getFilterClassName(isSelected: boolean) {
  return isSelected ? 'filter-button selected' : 'filter-button'
}

export default ExplorePage
