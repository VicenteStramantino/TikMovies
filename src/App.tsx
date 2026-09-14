import { useState } from 'react'
import 'boxicons/css/boxicons.min.css'
import Header, { type Screen } from './components/Header/Header'
import ToastContainer, { type Toast } from './components/Toast/Toast'
import DetailScreen from './components/screens/DetailScreen/DetailScreen'
import ExploreScreen from './components/screens/ExploreScreen/ExploreScreen'
import HomeScreen from './components/screens/HomeScreen/HomeScreen'
import ListsScreen from './components/screens/ListsScreen/ListsScreen'
import { movies, type Movie } from './data/movies'
import './App.css'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [watched, setWatched] = useState<number[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])

  function showToast(message: string, type: Toast['type']) {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, type }])
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 2500)
  }

  function toggleMovie(movie: Movie, list: 'watched' | 'favorites') {
    const setList = list === 'watched' ? setWatched : setFavorites
    const currentList = list === 'watched' ? watched : favorites
    const wasAdded = !currentList.includes(movie.id)

    setList((current) => {
      if (wasAdded) return [...current, movie.id]
      return current.filter((id) => id !== movie.id)
    })

    showToast(wasAdded ? `${movie.title} adicionado` : `${movie.title} removido`, list === 'watched' ? 'success' : 'favorite')
  }

  function selectMovie(movie: Movie) {
    setSelectedMovie(movie)
    setScreen('detail')
  }

  function navigate(nextScreen: Screen) {
    setScreen(nextScreen)
    setSelectedMovie(null)
    if (nextScreen !== 'explore') setSearchQuery('')
  }

  function search(query: string) {
    setSearchQuery(query)
    if (query) setScreen('explore')
  }

  return (
    <div className="app">
      <Header screen={screen} onNav={navigate} searchQuery={searchQuery} onSearch={search} />
      <ToastContainer toasts={toasts} />
      <main className="main-content">
        {screen === 'home' && (
          <HomeScreen
            movies={movies}
            watched={watched}
            favorites={favorites}
            onToggleWatched={(movie) => toggleMovie(movie, 'watched')}
            onToggleFavorite={(movie) => toggleMovie(movie, 'favorites')}
            onSelect={selectMovie}
          />
        )}
        {screen === 'explore' && <ExploreScreen movies={movies} searchQuery={searchQuery} onSelect={selectMovie} />}
        {screen === 'lists' && (
          <ListsScreen
            movies={movies}
            watched={watched}
            favorites={favorites}
            onToggleWatched={(movie) => toggleMovie(movie, 'watched')}
            onToggleFavorite={(movie) => toggleMovie(movie, 'favorites')}
            onSelect={selectMovie}
          />
        )}
        {screen === 'detail' && selectedMovie && (
          <DetailScreen
            movie={selectedMovie}
            watched={watched}
            favorites={favorites}
            onToggleWatched={(movie) => toggleMovie(movie, 'watched')}
            onToggleFavorite={(movie) => toggleMovie(movie, 'favorites')}
            onBack={() => navigate('home')}
          />
        )}
      </main>
    </div>
  )
}

export default App
