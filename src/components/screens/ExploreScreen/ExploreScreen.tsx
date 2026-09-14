import { useState } from 'react'
import type { Movie } from '../../../data/movies'
import { decades, genres } from '../../../data/movies'
import MovieCard from '../../MovieCard/MovieCard'
import './ExploreScreen.css'

type ExploreScreenProps = {
  movies: Movie[]
  searchQuery: string
  onSelect: (movie: Movie) => void
}

function ExploreScreen({ movies, searchQuery, onSelect }: ExploreScreenProps) {
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [selectedDecade, setSelectedDecade] = useState('Todas')

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre = selectedGenre === 'Todos' || movie.genres.includes(selectedGenre)
    const matchesDecade = selectedDecade === 'Todas' || movie.decade === selectedDecade
    const query = searchQuery.toLowerCase()
    const matchesSearch = movie.title.toLowerCase().includes(query) || movie.genres.some((genre) => genre.toLowerCase().includes(query))

    return matchesGenre && matchesDecade && matchesSearch
  })

  return (
    <section className="page-content">
      <p className="eyebrow">Catálogo</p>
      <h1>Explorar filmes</h1>

      <div className="filters">
        <fieldset>
          <legend>Gênero</legend>
          <div className="filter-buttons">
            {genres.map((genre) => (
              <button className={selectedGenre === genre ? 'filter-button selected' : 'filter-button'} key={genre} type="button" onClick={() => setSelectedGenre(genre)}>
                {genre}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Década</legend>
          <div className="filter-buttons">
            {decades.map((decade) => (
              <button className={selectedDecade === decade ? 'filter-button selected red' : 'filter-button'} key={decade} type="button" onClick={() => setSelectedDecade(decade)}>
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

export default ExploreScreen
