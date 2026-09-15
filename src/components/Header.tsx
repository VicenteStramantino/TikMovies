import { useState } from 'react'
import 'boxicons/css/boxicons.min.css'

export type Screen = 'home' | 'explore' | 'lists' | 'detail'

type HeaderProps = {
  screen: Screen
  onNav: (screen: Screen) => void
  searchQuery: string
  onSearch: (query: string) => void
}

const links: { name: string; screen: Screen }[] = [
  { name: 'Início', screen: 'home' },
  { name: 'Explorar', screen: 'explore' },
  { name: 'Minhas listas', screen: 'lists' },
]

function Header({ screen, onNav, searchQuery, onSearch }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false)

  function toggleSearch() {
    if (showSearch) {
      onSearch('')
    }

    setShowSearch((isVisible) => !isVisible)
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Navegação principal">
        <button className="brand" type="button" onClick={() => onNav('home')}>
          <span className="brand-cyan">Tik</span>
          <span className="brand-red">Movies</span>
        </button>

        <div className="nav-links">
          {links.map((link) => (
            <button
              className={screen === link.screen ? 'nav-link active' : 'nav-link'}
              key={link.screen}
              type="button"
              aria-current={screen === link.screen ? 'page' : undefined}
              onClick={() => onNav(link.screen)}
            >
              {link.name}
            </button>
          ))}
        </div>

        <form className="search-area" role="search" onSubmit={(event) => event.preventDefault()}>
          {showSearch && (
            <input
              autoFocus
              aria-label="Buscar filmes"
              className="search-input"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Buscar filmes..."
            />
          )}
          <button
            className="search-button"
            type="button"
            aria-label={showSearch ? 'Fechar busca' : 'Abrir busca'}
            aria-expanded={showSearch}
            onClick={toggleSearch}
          >
            <i className="bx bx-search" aria-hidden="true"></i>
          </button>
        </form>
      </nav>
    </header>
  )
}

export default Header
