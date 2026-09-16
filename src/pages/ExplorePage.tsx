import { useEffect } from 'react'
import type { Filme, ResumoFilme } from '../data/movies'
import { generos } from '../data/movies'
import MovieCard from '../components/MovieCard'

type PropriedadesExplorar = {
  filmes: Filme[]
  busca: string
  generoSelecionado: number
  carregando: boolean
  temMais: boolean
  aoMudarGenero: (idGenero: number) => void
  aoCarregarMais: () => void
  aoSelecionar: (filme: ResumoFilme) => void
}

function ExplorePage({ filmes, busca, generoSelecionado, carregando, temMais, aoMudarGenero, aoCarregarMais, aoSelecionar }: PropriedadesExplorar) {
  const filmesFiltrados = filmes.filter((filme) => generoSelecionado === 0 || filme.idsGeneros.includes(generoSelecionado))
  const temFiltro = generoSelecionado !== 0

  useEffect(() => {
    if (temFiltro) return undefined

    function aoRolar() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !carregando && temMais) {
        aoCarregarMais()
      }
    }

    window.addEventListener('scroll', aoRolar)
    return () => window.removeEventListener('scroll', aoRolar)
  }, [temFiltro, temMais, carregando, aoCarregarMais])

  return (
    <section className="page-content">
      <p className="eyebrow">Catálogo TMDB</p>
      <h1>{busca ? `Resultados para “${busca}”` : 'Explorar filmes'}</h1>

      <div className="filters">
        <fieldset>
          <legend>Gênero</legend>
          <div className="filter-buttons">
            {generos.map((genero) => (
              <button className={nomeClasseFiltro(generoSelecionado === genero.id)} key={genero.id} type="button" onClick={() => aoMudarGenero(genero.id)}>
                {genero.nome}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="result-count">{filmesFiltrados.length} filmes encontrados</p>
      {carregando && filmes.length === 0 ? <p className="empty-message">Carregando filmes...</p> : (
        <section className="movie-grid" aria-label="Filmes encontrados">
          {filmesFiltrados.map((filme) => <MovieCard key={filme.id} filme={filme} aoSelecionar={aoSelecionar} />)}
        </section>
      )}
      {!carregando && filmesFiltrados.length === 0 && <p className="empty-message">Nenhum filme encontrado.</p>}
      {temFiltro && temMais && <button className="primary-button load-more-button" type="button" onClick={aoCarregarMais} disabled={carregando}>{carregando ? 'Carregando...' : 'Carregar mais'}</button>}
      {!temMais && filmes.length > 0 && <p className="result-count end-message">Você chegou ao fim dos resultados.</p>}
    </section>
  )
}

function nomeClasseFiltro(estaSelecionado: boolean) {
  return estaSelecionado ? 'filter-button selected' : 'filter-button'
}

export default ExplorePage
