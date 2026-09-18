import { useEffect } from 'react'
import type { Filme, ResumoFilme } from '../models/movie'
import { generos } from '../data/genres'
import CartaoFilme from '../components/MovieCard'

type PropriedadesExplorar = {
  filmes: Filme[]
  busca: string
  generoSelecionado: number
  carregando: boolean
  erro: boolean
  temMais: boolean
  onMudarGenero: (idGenero: number) => void
  onCarregarMais: () => void
  onSelecionar: (filme: ResumoFilme) => void
}

function PaginaExplorar({
  filmes,
  busca,
  generoSelecionado,
  carregando,
  erro,
  temMais,
  onMudarGenero,
  onCarregarMais,
  onSelecionar,
}: PropriedadesExplorar) {
  const filmesFiltrados = filmes.filter((filme) => generoSelecionado === 0 || filme.idsGeneros.includes(generoSelecionado))
  const temFiltro = generoSelecionado !== 0
  const mostrarCarregando = carregando ? filmes.length === 0 : false
  const mostrarNenhumFilme = erro ? false : carregando ? false : filmesFiltrados.length === 0
  const mostrarBotaoCarregarMais = temFiltro ? temMais : false
  const mostrarFimDosResultados = temMais ? false : filmes.length > 0

  useEffect(() => {
    if (temFiltro) return undefined

    function onRolar() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !carregando && temMais) {
        onCarregarMais()
      }
    }

    window.addEventListener('scroll', onRolar)
    return () => window.removeEventListener('scroll', onRolar)
  }, [temFiltro, temMais, carregando, onCarregarMais])

  return (
    <section className="conteudo-pagina">
      <p className="subtitulo">Catalogo TMDB</p>
      <h1>{busca ? `Resultados para "${busca}"` : 'Explorar filmes'}</h1>

      <div className="filtros">
        <fieldset>
          <legend>Genero</legend>
          <div className="botoes-filtro">
            {generos.map((genero) => (
              <button
                className={nomeClasseFiltro(generoSelecionado === genero.id)}
                key={genero.id}
                type="button"
                onClick={() => onMudarGenero(genero.id)}
              >
                {genero.nome}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="contagem-resultados">{filmesFiltrados.length} filmes encontrados</p>
      {erro
        ? <p className="mensagem-vazia">Nao foi possivel carregar os filmes. Verifique a chave da API do TMDB.</p>
        : mostrarCarregando
        ? <p className="mensagem-vazia">Carregando filmes...</p>
        : (
          <section className="grade-filmes" aria-label="Filmes encontrados">
            {filmesFiltrados.map((filme) => (
              <CartaoFilme key={filme.id} filme={filme} onSelecionar={onSelecionar} />
            ))}
          </section>
        )}

      {mostrarNenhumFilme ? <p className="mensagem-vazia">Nenhum filme encontrado.</p> : null}
      {mostrarBotaoCarregarMais ? (
        <button className="botao-principal botao-carregar-mais" type="button" onClick={onCarregarMais} disabled={carregando}>
          {carregando ? 'Carregando...' : 'Carregar mais'}
        </button>
      ) : null}

      {mostrarFimDosResultados ? <p className="contagem-resultados mensagem-final">Voce chegou ao fim dos resultados.</p> : null}
    </section>
  )
}

function nomeClasseFiltro(estaSelecionado: boolean) {
  return estaSelecionado ? 'botao-filtro selecionado' : 'botao-filtro'
}

export default PaginaExplorar
