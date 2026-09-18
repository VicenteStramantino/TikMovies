import type { Filme } from '../models/movie'

type PropriedadesDetalhes = {
  filme: Filme
  assistido: boolean
  favorito: boolean
  estaNaLista: boolean
  onAlternarAssistido: () => void
  onAlternarFavorito: () => void
  onAlternarQueroAssistir: () => void
  onVoltar: () => void
}

function PaginaDetalhes({ filme, assistido, favorito, estaNaLista, onAlternarAssistido, onAlternarFavorito, onAlternarQueroAssistir, onVoltar }: PropriedadesDetalhes) {
  const streaming = filme.plataformas.length > 0 ? filme.plataformas.join(', ') : 'Nenhum streaming encontrado'
  const orcamento = filme.orcamento > 0 ? `$ ${filme.orcamento.toLocaleString('en-US')}` : 'Não informado'
  
  return (
    <section className="pagina-detalhes">
      <div className="fundo-detalhes" aria-hidden="true" style={{ backgroundImage: `url(${filme.fundo})` }} />

      <div className="conteudo-detalhes">
        <button className="botao-voltar" type="button" onClick={onVoltar}>
          <i className="bx bx-arrow-back" aria-hidden="true" /> Voltar
        </button>

        <div className="estrutura-detalhes">
          <div className="coluna-poster">
            {filme.poster
              ? <img className="poster-detalhes" src={filme.poster} alt={`Capa do filme ${filme.titulo}`} />
              : <div className="poster-detalhes poster-sem-imagem">Sem poster</div>
              }

            <div className="acoes-detalhes">
              <button className={`acao-detalhe ${assistido ? 'ativo' : ''}`} type="button" onClick={onAlternarAssistido}>
                <i className={`bx ${assistido ? 'bxs-show' : 'bx-show'}`} aria-hidden="true" />

                <span>{assistido ? 'Assistido' : 'Marcar assistido'}</span>
              </button>

              <button className={`acao-detalhe ${favorito ? 'ativo' : ''}`} type="button" onClick={onAlternarFavorito}>
                <i className={`bx ${favorito ? 'bxs-heart' : 'bx-heart'}`} aria-hidden="true" />
                <span>{favorito ? 'Favorito' : 'Favoritar'} </span>
              </button>

              <button className={`acao-detalhe ${estaNaLista ? 'ativo' : ''}`} type="button" onClick={onAlternarQueroAssistir}>
                <i className={`bx ${estaNaLista ? 'bxs-bookmark-plus' : 'bx-bookmark-plus'}`} aria-hidden="true" />
                <span>{estaNaLista ? 'Na lista' : 'Quero assistir'}</span>
              </button>

            </div>

          </div>

          <section className="informacoes-detalhes" aria-labelledby="titulo-filme">
            <ul className="lista-generos" aria-label="Generos">
              {filme.generos.map((genero) => <li key={genero}>{genero}</li>)}
            </ul>

            <h1 id="titulo-filme">{filme.titulo}</h1>
            <p className="meta-filme">
              {filme.anoLancamento || 'Ano nao informado'} <span>•</span>
              <strong>
                <i className="bx bxs-star" aria-hidden="true" />{filme.avaliacao}
              </strong>
            </p>
            <p className="descricao-detalhes">{filme.descricao}</p>

            <ul className="detalhes-filme" aria-label="Informacoes do filme">
              <li>
                <strong className="rotulo-detalhe-filme">Data de lancamento</strong>
                <span className="valor-detalhe-filme">{filme.anoLancamento || 'Nao informado'}</span>
              </li>
              <li>
                <strong className="rotulo-detalhe-filme">Avaliacao</strong>
                <span className="valor-detalhe-filme texto-ciano">{filme.avaliacao} / 10</span>
              </li>
              <li>
                <strong className="rotulo-detalhe-filme">Orcamento</strong>
                <span className="valor-detalhe-filme">{orcamento}</span>
              </li>
              <li>
                <strong className="rotulo-detalhe-filme">Produtores</strong>
                <span className="valor-detalhe-filme">
                  {filme.produtores.length > 0 ? filme.produtores.join(', ') : 'Nao informado'}
                </span>
              </li>
              <li>
                <strong className="rotulo-detalhe-filme">Onde assistir</strong>
                <span className="valor-detalhe-filme">{streaming}</span>
              </li>
            </ul>

          </section>

        </div>
      </div>

    </section>
  )
}

export default PaginaDetalhes