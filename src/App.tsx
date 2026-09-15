import { useState } from 'react'
import 'boxicons/css/boxicons.min.css'
import Header, { type Screen } from './components/Header'
import NotificationContainer, { type Notification } from './components/Notification'
import DetailPage from './pages/DetailPage'
import ExplorePage from './pages/ExplorePage'
import HomePage from './pages/HomePage'
import ListsPage from './pages/ListsPage'
import { movies, type Movie } from './data/movies'
import './App.css'

type MovieList = 'watched' | 'favorites' | 'toWatch'

const notificationTypes: Record<MovieList, Notification['type']> = {
  watched: 'success',
  favorites: 'favorite',
  toWatch: 'watchlist',
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [movieLists, setMovieLists] = useState<Record<MovieList, number[]>>({ watched: [], favorites: [], toWatch: [] })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { watched, favorites, toWatch } = movieLists

  function showNotification(message: string, type: Notification['type']) {
    const id = Date.now()
    setNotifications((current) => [...current, { id, message, type }])
    setTimeout(() => setNotifications((current) => current.filter((notification) => notification.id !== id)), 2500)
  }

  function toggleMovie(movie: Movie, list: MovieList) {
    const wasAdded = !movieLists[list].includes(movie.id)
    setMovieLists((current) => ({
      ...current,
      [list]: wasAdded
        ? [...current[list], movie.id]
        : current[list].filter((id) => id !== movie.id),
    }))

    const notificationType = notificationTypes[list]
    const action = wasAdded ? 'adicionado' : 'removido'
    showNotification(`${movie.title} ${action}`, notificationType)
  }

  function toggleWatched(movie: Movie) {
    toggleMovie(movie, 'watched')
  }

  function toggleFavorite(movie: Movie) {
    toggleMovie(movie, 'favorites')
  }

  function toggleToWatch(movie: Movie) {
    toggleMovie(movie, 'toWatch')
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
      <NotificationContainer notifications={notifications} />
      <main className="main-content">
        {screen === 'home' && (
          <HomePage
            movies={movies}
            watched={watched}
            favorites={favorites}
            toWatch={toWatch}
            onToggleWatched={toggleWatched}
            onToggleFavorite={toggleFavorite}
            onToggleToWatch={toggleToWatch}
            onSelect={selectMovie}
          />
        )}
        {screen === 'explore' && <ExplorePage movies={movies} searchQuery={searchQuery} onSelect={selectMovie} />}
        {screen === 'lists' && (
          <ListsPage
            movies={movies}
            watched={watched}
            favorites={favorites}
            toWatch={toWatch}
            onToggleWatched={toggleWatched}
            onToggleFavorite={toggleFavorite}
            onToggleToWatch={toggleToWatch}
            onSelect={selectMovie}
          />
        )}
        {screen === 'detail' && selectedMovie && (
          <DetailPage
            movie={selectedMovie}
            watched={watched}
            favorites={favorites}
            toWatch={toWatch}
            onToggleWatched={toggleWatched}
            onToggleFavorite={toggleFavorite}
            onToggleToWatch={toggleToWatch}
            onBack={() => navigate('home')}
          />
        )}
      </main>
    </div>
  )
}

export default App
