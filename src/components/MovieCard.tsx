import type { ResumoFilme } from '../models/movie'

type PropriedadesCard = {
  filme: ResumoFilme & { avaliacao?: number; plataformas?: string[] }
  onSelecionar: (filme: ResumoFilme) => void
  onRemover?: () => void
}

function CartaoFilme({ filme, onSelecionar, onRemover }: PropriedadesCard) {
  const plataformas = filme.plataformas ?? []

  return (
    <article className="cartao-filme">
      <button className="botao-cartao-filme" type="button" onClick={() => onSelecionar(filme)}>
        <span className="area-poster">
          {filme.poster
            ? <img src={filme.poster} alt={`Capa do filme ${filme.titulo}`} className="poster-filme" />
            : <span className="poster-sem-imagem">Sem poster</span>}
        </span>
        <span className="informacoes-cartao">
          <span className="titulo-cartao">{filme.titulo}</span>
          <span className="meta-cartao">{filme.anoLancamento || 'Ano nao informado'}{filme.avaliacao ? ` · ${filme.avaliacao}` : ''}</span>
          {plataformas.length > 0 ? (
            <span className="streaming-filme" title={`Onde assistir: ${plataformas.join(', ')}`}>
              <i className="bx bx-tv" aria-hidden="true" /> {plataformas.join(', ')}
            </span>
          ) : null}
        </span>
      </button>
      {onRemover ? (
        <button
          className="botao-remover"
          type="button"
          aria-label={`Remover ${filme.titulo}`}
          onClick={(evento) => {
            evento.stopPropagation()
            onRemover()
          }}
        >
          <i className="bx bx-x" aria-hidden="true" />
        </button>
      ) : null}
    </article>
  )
}

export default CartaoFilme
