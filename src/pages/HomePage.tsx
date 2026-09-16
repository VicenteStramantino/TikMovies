import { useEffect, useState } from 'react'
import type { Filme, ResumoFilme } from '../data/movies'
import MovieCard from '../components/MovieCard'

type HomePageProps = {
  filmes: Filme[]
  filmesRecomendados: Filme[]
  assistidos: ResumoFilme[]
  favoritos: ResumoFilme[]
  queroAssistir: ResumoFilme[]
  aoAlternarAssistido: (filme: ResumoFilme) => void
  aoAlternarFavorito: (filme: ResumoFilme) => void
  aoAlternarQueroAssistir: (filme: ResumoFilme) => void
  aoSelecionar: (filme: ResumoFilme) => void
  aoExplorar: () => void
}

function HomePage({ filmes, filmesRecomendados, assistidos, favoritos, queroAssistir, aoAlternarAssistido, aoAlternarFavorito, aoAlternarQueroAssistir, aoSelecionar, aoExplorar }: HomePageProps) {
  const [destaque, setDestaque] = useState<Filme | null>(null)

  useEffect(() => {
    const filmesDisponiveis = filmes.filter((filme) => !assistidos.some((filmeSalvo) => filmeSalvo.id === filme.id))
    const timer = window.setTimeout(() => {
      setDestaque(filmesDisponiveis[Math.floor(Math.random() * filmesDisponiveis.length)] ?? filmes[0] ?? null)
    })
    return () => window.clearTimeout(timer)
  }, [filmes, assistidos])

  if (!destaque) {
    return <p className="empty-message">Carregando filmes...</p>
  }

  const destaqueFoiAssistido = assistidos.some((filme) => filme.id === destaque.id)
  const destaqueEhFavorito = favoritos.some((filme) => filme.id === destaque.id)
  const destaqueEstaNaLista = queroAssistir.some((filme) => filme.id === destaque.id)

  return (
    <div>
      <section className="hero" style={{ backgroundImage: `url(${destaque.fundo})` }}>
        <div className="hero-content">
          <p className="eyebrow">Filme em destaque</p>
          <h1>{destaque.titulo}</h1>
          <p>{destaque.descricao}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => aoAlternarAssistido(destaque)}>
              <i className="bx bx-show" aria-hidden="true" />
              {destaqueFoiAssistido ? 'Já assisti' : 'Marcar como assistido'}
            </button>
            <button className="secondary-button" type="button" onClick={() => aoAlternarFavorito(destaque)}>
              <i className={destaqueEhFavorito ? 'bx bxs-heart' : 'bx bx-heart'} aria-hidden="true" />
              {destaqueEhFavorito ? 'Favorito' : 'Favoritar'}
            </button>
            <button className="secondary-button" type="button" onClick={() => aoAlternarQueroAssistir(destaque)}>
              <i className={destaqueEstaNaLista ? 'bx bxs-bookmark-plus' : 'bx bx-bookmark-plus'} aria-hidden="true" />
              {destaqueEstaNaLista ? 'Quero assistir' : 'Adicionar à lista'}
            </button>
          </div>
        </div>
      </section>

      <section className="content-section">
        {filmesRecomendados.length > 0 && <MovieRow title="Recomendados para você" filmes={filmesRecomendados} aoSelecionar={aoSelecionar} />}
        <MovieRow title="Mais bem avaliados" filmes={filmes} aoSelecionar={aoSelecionar} />
        <button className="primary-button see-more-button" type="button" onClick={aoExplorar}>Ver mais</button>
      </section>
    </div>
  )
}

type MovieRowProps = { title: string; filmes: Filme[]; aoSelecionar: (filme: ResumoFilme) => void }

function MovieRow({ title, filmes, aoSelecionar }: MovieRowProps) {
  return (
    <section className="movie-row" aria-label={title}>
      <h2>{title}</h2>
      <div className="movie-row-list">
        {filmes.map((filme) => <MovieCard key={filme.id} filme={filme} aoSelecionar={aoSelecionar} />)}
      </div>
    </section>
  )
}

export default HomePage
