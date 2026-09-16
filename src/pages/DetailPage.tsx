import type { Filme } from '../data/movies'

type PropriedadesDetalhes = {
  filme: Filme
  assistido: boolean
  favorito: boolean
  estaNaLista: boolean
  aoAlternarAssistido: () => void
  aoAlternarFavorito: () => void
  aoAlternarQueroAssistir: () => void
  aoVoltar: () => void
}

function DetailPage({ filme, assistido, favorito, estaNaLista, aoAlternarAssistido, aoAlternarFavorito, aoAlternarQueroAssistir, aoVoltar }: PropriedadesDetalhes) {
  const streaming = filme.plataformas.length > 0 ? filme.plataformas.join(', ') : 'Não disponível para streaming no Brasil'
  const orcamento = filme.orcamento > 0 ? `$ ${filme.orcamento.toLocaleString('en-US')}` : 'Não informado'
  const acoes = [
    { icone: 'bx-show', iconeAtivo: 'bxs-show', ativo: assistido, ativoTexto: 'Assistido', inativoTexto: 'Marcar assistido', aoClicar: aoAlternarAssistido },
    { icone: 'bx-heart', iconeAtivo: 'bxs-heart', ativo: favorito, ativoTexto: 'Favorito', inativoTexto: 'Favoritar', aoClicar: aoAlternarFavorito },
    { icone: 'bx-bookmark-plus', iconeAtivo: 'bxs-bookmark-plus', ativo: estaNaLista, ativoTexto: 'Na lista', inativoTexto: 'Quero assistir', aoClicar: aoAlternarQueroAssistir },
  ]

  return (
    <section className="detail-page">
      <div className="detail-backdrop" aria-hidden="true" style={{ backgroundImage: `url(${filme.fundo})` }} />
      <div className="detail-content">
        <button className="back-button" type="button" onClick={aoVoltar}><i className="bx bx-arrow-back" aria-hidden="true" /> Voltar</button>
        <div className="detail-layout">
          <div className="poster-column">
            {filme.poster ? <img className="detail-poster" src={filme.poster} alt={`Capa do filme ${filme.titulo}`} /> : <div className="detail-poster poster-placeholder">Sem pôster</div>}
            <div className="detail-actions">
              {acoes.map((acao) => <button className={`detail-action ${acao.ativo ? 'active' : ''}`} type="button" onClick={acao.aoClicar} key={acao.ativoTexto}><i className={`bx ${acao.ativo ? acao.iconeAtivo : acao.icone}`} aria-hidden="true" /><span>{acao.ativo ? acao.ativoTexto : acao.inativoTexto}</span></button>)}
            </div>
          </div>

          <section className="detail-info" aria-labelledby="movie-title">
            <ul className="genre-list" aria-label="Gêneros">{filme.generos.map((genero) => <li key={genero}>{genero}</li>)}</ul>
            <h1 id="movie-title">{filme.titulo}</h1>
            <p className="movie-meta">{filme.anoLancamento || 'Ano não informado'} <span>•</span> <strong>★ {filme.avaliacao}</strong></p>
            <p className="detail-description">{filme.descricao}</p>

            <ul className="movie-details" aria-label="Informações do filme">
              <li><strong className="movie-detail-label">Data de lançamento</strong><span className="movie-detail-value">{filme.anoLancamento || 'Não informado'}</span></li>
              <li><strong className="movie-detail-label">Avaliação</strong><span className="movie-detail-value cyan-text">{filme.avaliacao} / 10</span></li>
              <li><strong className="movie-detail-label">Orçamento</strong><span className="movie-detail-value">{orcamento}</span></li>
              <li><strong className="movie-detail-label">Produtores</strong><span className="movie-detail-value">{filme.produtores.length > 0 ? filme.produtores.join(', ') : 'Não informado'}</span></li>
              <li><strong className="movie-detail-label">Onde assistir</strong><span className="movie-detail-value">{streaming}</span></li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  )
}

export default DetailPage
