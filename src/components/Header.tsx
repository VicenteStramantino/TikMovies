import { type ReactNode, useState } from 'react'
import { Link } from 'react-router'
import 'boxicons/css/boxicons.min.css'

type PropriedadesCabecalho ={
  busca:  string
  onPesquisar: (texto:string) => void

}

const linksNavegacao = [
  {nome: 'Inicio', caminho: '/' },
  {nome: 'Explorar', caminho: '/explorar' },
  {nome: 'Minhas listas', caminho: '/listas' },
  
]

function Cabecalho({busca, onPesquisar}:PropriedadesCabecalho) {
  const [mostrarBusca, definirMostrarBusca] =useState(false)
  const links: ReactNode[] = []

  for (const link of linksNavegacao) {
    links.push(
      <Link className="link-navegacao" key={link.caminho} to={link.caminho}>
        {link.nome}
      </Link>,
    )
  }

  function alternarBusca(){
    if (mostrarBusca) {
      onPesquisar('')
    } else {
      onPesquisar(busca)
    }
    definirMostrarBusca((visivel) => !visivel)

  }

  return (

    <header className="cabecalho-site">
      <nav className="barra-navegacao" aria-label="Navegacao principal">
        <Link className="marca"  to="/">
          <span className="marca-ciano">Tik</span>
          <span className="marca-vermelha">Movies</span>
        </Link>

        <div className="links-navegacao">
          {links}
        </div>

        <form className="area-busca" role="search" onSubmit={(event) => event.preventDefault()}>
          {mostrarBusca ? (
            <input
              autoFocus
              aria-label="Buscar filmes"
              className="entrada-busca"
              type="search"
              value={busca}
              onChange={(evento) =>onPesquisar(evento.target.value)}
              placeholder="Buscar filme"
            />
          ) : null}

          <button
            className="botao-busca"
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
export default Cabecalho
