import { useState } from 'react'
import 'boxicons/css/boxicons.min.css'

export type Screen = 'home' | 'explore' | 'lists' | 'detail'

type HeaderProps = {
  screen: Screen
  aoNavegar: (screen: Screen) => void
  busca: string
  aoPesquisar: (texto: string) => void
}

const linksNavegacao: { nome: string; tela: Screen }[] = [
  { nome: 'Início', tela: 'home' },
  { nome: 'Explorar', tela: 'explore' },
  { nome: 'Minhas listas', tela: 'lists' },
]

function Header({ screen, aoNavegar, busca, aoPesquisar }: HeaderProps) {
  const [mostrarBusca, definirMostrarBusca] = useState(false)

  function alternarBusca() {
    if (mostrarBusca) {
      aoPesquisar('')
    }

    definirMostrarBusca((visivel) => !visivel)
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Navegação principal">
        <button className="brand" type="button" onClick={() => aoNavegar('home')}>
          <span className="brand-cyan">Tik</span>
          <span className="brand-red">Movies</span>
        </button>

        <div className="nav-links">
          {linksNavegacao.map((link) => (
            <button
              className={screen === link.tela ? 'nav-link active' : 'nav-link'}
              key={link.tela}
              type="button"
              aria-current={screen === link.tela ? 'page' : undefined}
              onClick={() => aoNavegar(link.tela)}
            >
              {link.nome}
            </button>
          ))}
        </div>

        <form className="search-area" role="search" onSubmit={(event) => event.preventDefault()}>
          {mostrarBusca && (
            <input
              autoFocus
              aria-label="Buscar filmes"
              className="search-input"
              type="search"
              value={busca}
              onChange={(event) => aoPesquisar(event.target.value)}
              placeholder="Buscar filmes..."
            />
          )}
          <button
            className="search-button"
            type="button"
            aria-label={mostrarBusca ? 'Fechar busca' : 'Abrir busca'}
            aria-expanded={mostrarBusca}
            onClick={alternarBusca}
          >
            <i className="bx bx-search" aria-hidden="true"></i>
          </button>
        </form>
      </nav>
    </header>
  )
}

export default Header
