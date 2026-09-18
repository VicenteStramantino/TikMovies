import { useEffect, useState } from 'react'
import type { Filme, ResumoFilme } from '../models/movie'
import CartaoFilme from '../components/MovieCard'

type PropriedadesPaginaInicial = {
  filmes: Filme[]
  filmesRecomendados: Filme[]
  erroCarregamento: boolean
  assistidos: ResumoFilme[]
  favoritos: ResumoFilme[]
  queroAssistir: ResumoFilme[]
  onAlternarAssistido: (filme: ResumoFilme) => void
  onAlternarFavorito: (filme: ResumoFilme) => void
  onAlternarQueroAssistir: (filme: ResumoFilme) => void
  onSelecionar: (filme: ResumoFilme) => void
  onExplorar: () => void
}

function PaginaInicial({
  filmes,
  filmesRecomendados,
  erroCarregamento,
  assistidos,
  favoritos,
  queroAssistir,
  onAlternarAssistido,
  onAlternarFavorito,
  onAlternarQueroAssistir,
  onSelecionar,
  onExplorar,
}: PropriedadesPaginaInicial) {
  const [destaque, setDestaque] = useState<Filme | null>(null)

  useEffect(() => {
    const filmesDisponiveis = filmes.filter((filme) => !assistidos.some((filmeSalvo) => filmeSalvo.id === filme.id))
    const timer = window.setTimeout(() => {
      setDestaque(filmesDisponiveis[Math.floor(Math.random() * filmesDisponiveis.length)] ?? filmes[0] ?? null)
    })
    return () => window.clearTimeout(timer)
  }, [filmes, assistidos])

  if (erroCarregamento) {
    return <p className="mensagem-vazia">Nao foi possivel carregar os filmes. Verifique a chave da API do TMDB.</p>
  }

  if (!destaque) {
    return <p className="mensagem-vazia">Carregando filmes...</p>
  }

  const destaqueFoiAssistido = assistidos.some((filme) => filme.id === destaque.id)
  const destaqueEhFavorito = favoritos.some((filme) => filme.id === destaque.id)
  const destaqueEstaNaLista = queroAssistir.some((filme) => filme.id === destaque.id)

  return (
    <div>
      <section className="destaque" style={{ backgroundImage: `url(${destaque.fundo})` }}>
        <div className="conteudo-destaque">
          <p className="subtitulo">Filme em destaque</p>
          <h1>{destaque.titulo}</h1>
          <p>{destaque.descricao}</p>
          <div className="acoes-destaque">
            <button className="botao-principal" type="button" onClick={() => onAlternarAssistido(destaque)}>
              <i className="bx bx-show" aria-hidden="true" />
              {destaqueFoiAssistido ? 'Ja assisti' : 'Marcar como assistido'}
            </button>
            <button className="botao-secundario" type="button" onClick={() => onAlternarFavorito(destaque)}>
              <i className={destaqueEhFavorito ? 'bx bxs-heart' : 'bx bx-heart'} aria-hidden="true" />
              {destaqueEhFavorito ? 'Favorito' : 'Favoritar'}
            </button>
            <button className="botao-secundario" type="button" onClick={() => onAlternarQueroAssistir(destaque)}>
              <i className={destaqueEstaNaLista ? 'bx bxs-bookmark-plus' : 'bx bx-bookmark-plus'} aria-hidden="true" />
              {destaqueEstaNaLista ? 'Quero assistir' : 'Adicionar a lista'}
            </button>
          </div>
        </div>
      </section>

      <section className="secao-conteudo">
        {filmesRecomendados.length > 0 ? <LinhaFilmes titulo="Recomendados para voce" filmes={filmesRecomendados} onSelecionar={onSelecionar} /> : null}
        <LinhaFilmes titulo="Mais bem avaliados" filmes={filmes} onSelecionar={onSelecionar} />
        <button className="botao-principal botao-ver-mais" type="button" onClick={onExplorar}>Ver mais</button>
      </section>
    </div>
  )
}

type PropriedadesLinhaFilmes = {
  titulo: string
  filmes: Filme[]
  onSelecionar: (filme: ResumoFilme) => void
}

function LinhaFilmes({ titulo, filmes, onSelecionar }: PropriedadesLinhaFilmes) {
  return (
    <section className="linha-filmes" aria-label={titulo}>
      <h2>{titulo}</h2>
      <div className="lista-linha-filmes">
        {filmes.map((filme) => <CartaoFilme key={filme.id} filme={filme} onSelecionar={onSelecionar} />)}
      </div>
    </section>
  )
}

export default PaginaInicial
