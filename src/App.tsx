import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import 'boxicons/css/boxicons.min.css'
import Header from './components/Header'
import PaginaDetalhes from './pages/DetailPage'
import PaginaExplorar from './pages/ExplorePage'
import PaginaInicial from './pages/HomePage'
import PaginaListas from './pages/ListsPage'
import { ProvedorAplicacao } from './context/AppContext'
import { useAplicacao } from './context/useApp'
import { buscarDetalhes } from './services/tmdb'
import type { Filme, ResumoFilme } from './models/movie'
import './App.css'

function Aplicacao() {
  return (
    <ProvedorAplicacao filhos={<EstruturaPrincipal />} />
  )
}

function EstruturaPrincipal() {
  const { busca, definirBusca } = useAplicacao()
  const navegar = useNavigate()

  function pesquisar(texto: string) {
    definirBusca(texto)
    navegar('/explorar')
  }

  return (
    <div className="aplicativo">
      <Header busca={busca} onPesquisar={pesquisar} />
      <main className="conteudo-principal">
        <Outlet />
      </main>
    </div>
  )
}

export function RotaInicial() {
  const {
    filmesInicio,
    filmesRecomendados,
    assistidos,
    favoritos,
    queroAssistir,
    erroInicio,
    alternarFilme,
  } = useAplicacao()
  const navegar = useNavigate()

  function selecionarFilme(filme: ResumoFilme) {
    navegar(`/filme/${filme.id}`)
  }

  return (
    <PaginaInicial
      filmes={filmesInicio}
      filmesRecomendados={filmesRecomendados}
      erroCarregamento={erroInicio}
      assistidos={assistidos}
      favoritos={favoritos}
      queroAssistir={queroAssistir}
      onAlternarAssistido={(filme) => alternarFilme(filme, 'assistidos')}
      onAlternarFavorito={(filme) => alternarFilme(filme, 'favoritos')}
      onAlternarQueroAssistir={(filme) => alternarFilme(filme, 'queroAssistir')}
      onSelecionar={selecionarFilme}
      onExplorar={() => navegar('/explorar')}
    />
  )
}

export function RotaExplorar() {
  const {
    filmesExplorar,
    busca,
    generoSelecionado,
    carregandoExplorar,
    erroExplorar,
    temMais,
    definirGeneroSelecionado,
    carregarMaisFilmes,
  } = useAplicacao()
  const navegar = useNavigate()

  function selecionarFilme(filme: ResumoFilme) {
    navegar(`/filme/${filme.id}`)
  }

  return (
    <PaginaExplorar
      filmes={filmesExplorar}
      busca={busca}
      generoSelecionado={generoSelecionado}
      carregando={carregandoExplorar}
      erro={erroExplorar}
      temMais={temMais}
      onMudarGenero={definirGeneroSelecionado}
      onCarregarMais={carregarMaisFilmes}
      onSelecionar={selecionarFilme}
    />
  )
}

export function RotaListas() {
  const {
    assistidos,
    favoritos,
    queroAssistir,
    alternarFilme,
  } = useAplicacao()
  const navegar = useNavigate()

  function selecionarFilme(filme: ResumoFilme) {
    navegar(`/filme/${filme.id}`)
  }

  return (
    <PaginaListas
      assistidos={assistidos}
      favoritos={favoritos}
      queroAssistir={queroAssistir}
      onAlternarAssistido={(filme) => alternarFilme(filme, 'assistidos')}
      onAlternarFavorito={(filme) => alternarFilme(filme, 'favoritos')}
      onAlternarQueroAssistir={(filme) => alternarFilme(filme, 'queroAssistir')}
      onSelecionar={selecionarFilme}
    />
  )
}

export function RotaDetalhes() {
  const { id } = useParams()
  const navegar = useNavigate()
  const {
    assistidos,
    favoritos,
    queroAssistir,
    alternarFilme,
  } = useAplicacao()
  const numeroId = Number(id)
  const idValido = id !== undefined && !Number.isNaN(numeroId)
  const [resultado, definirResultado] = useState<{ id: number; filme: Filme | null; erro: boolean } | null>(null)

  useEffect(() => {
    if (!idValido) return

    buscarDetalhes(numeroId)
      .then((filme) => definirResultado({ id: numeroId, filme, erro: false }))
      .catch(() => definirResultado({ id: numeroId, filme: null, erro: true }))
  }, [idValido, numeroId])

  if (!idValido) {
    return <p className="mensagem-vazia">Nao foi possivel carregar este filme.</p>
  }

  if (!resultado || resultado.id !== numeroId) {
    return <p className="mensagem-vazia">Carregando detalhes...</p>
  }

  if (resultado.erro || !resultado.filme) {
    return <p className="mensagem-vazia">Nao foi possivel carregar este filme.</p>
  }

  const filme = resultado.filme

  return (
    <PaginaDetalhes
      filme={filme}
      assistido={assistidos.some((item) => item.id === filme.id)}
      favorito={favoritos.some((item) => item.id === filme.id)}
      estaNaLista={queroAssistir.some((item) => item.id === filme.id)}
      onAlternarAssistido={() => alternarFilme(filme, 'assistidos')}
      onAlternarFavorito={() => alternarFilme(filme, 'favoritos')}
      onAlternarQueroAssistir={() => alternarFilme(filme, 'queroAssistir')}
      onVoltar={() => navegar(-1)}
    />
  )
}

export function PaginaNaoEncontrada() {
  return <p className="mensagem-vazia">Pagina nao encontrada.</p>
}

export default Aplicacao
