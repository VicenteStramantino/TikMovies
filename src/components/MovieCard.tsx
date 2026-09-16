import type { ResumoFilme } from '../data/movies'

type PropriedadesCartao = {
  filme: ResumoFilme & { avaliacao?: number; plataformas?: string[] }
  aoSelecionar: (filme: ResumoFilme) => void
  aoRemover?: () => void
}

function MovieCard({ filme, aoSelecionar, aoRemover }: PropriedadesCartao) {
  const plataformas = filme.plataformas ?? []

  return (
    <article className="movie-card">
      <button className="movie-card-button" type="button" onClick={() => aoSelecionar(filme)}>
        <div className="poster-container">
          {filme.poster ? <img src={filme.poster} alt={`Capa do filme ${filme.titulo}`} className="movie-poster" /> : <div className="poster-placeholder">Sem pôster</div>}
        </div>
        <div className="movie-card-info">
          <h3>{filme.titulo}</h3>
          <p>{filme.anoLancamento || 'Ano não informado'}{filme.avaliacao ? ` · ${filme.avaliacao}` : ''}</p>
          {plataformas.length > 0 && <p className="movie-streaming" title={`Onde assistir: ${plataformas.join(', ')}`}><i className="bx bx-tv" aria-hidden="true" /> {plataformas.join(', ')}</p>}
        </div>
      </button>
      {aoRemover && (
        <button className="remove-button" type="button" aria-label={`Remover ${filme.titulo}`} onClick={(evento) => { evento.stopPropagation(); aoRemover() }}>
          <i className="bx bx-x" aria-hidden="true" />
        </button>
      )}
    </article>
  )
}

export default MovieCard
