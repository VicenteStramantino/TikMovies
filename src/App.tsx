import { useEffect, useState } from 'react'
import 'boxicons/css/boxicons.min.css'
import Header, { type Screen } from './components/Header'
import DetailPage from './pages/DetailPage'
import ExplorePage from './pages/ExplorePage'
import HomePage from './pages/HomePage'
import ListsPage from './pages/ListsPage'
import type { Filme, FilmeSalvo, ResumoFilme } from './data/movies'
import { buscarDescobertas, buscarDetalhes, buscarFilmes, buscarMaisAvaliados } from './services/tmdb'
import './App.css'

type TipoLista = 'watched' | 'favorites' | 'toWatch'
type ListasDeFilmes = {
  watched: FilmeSalvo[]
  favorites: FilmeSalvo[]
  toWatch: FilmeSalvo[]
}
function lerLista(tipo: TipoLista): FilmeSalvo[] {
  try {
    const valor = localStorage.getItem(`tikmovies-${tipo}`)
    return valor ? JSON.parse(valor) as FilmeSalvo[] : []
  } catch {
    return []
  }
}

function salvarListas(listas: ListasDeFilmes) {
  localStorage.setItem('tikmovies-watched', JSON.stringify(listas.watched))
  localStorage.setItem('tikmovies-favorites', JSON.stringify(listas.favorites))
  localStorage.setItem('tikmovies-toWatch', JSON.stringify(listas.toWatch))
}

function transformarEmFilmeSalvo(filme: ResumoFilme): FilmeSalvo {
  return { id: filme.id, titulo: filme.titulo, anoLancamento: filme.anoLancamento, poster: filme.poster, idsGeneros: filme.idsGeneros }
}

function juntarFilmes(atuais: Filme[], novos: Filme[]) {
  const resultado = [...atuais]
  for (const novoFilme of novos) {
    const filmeJaExiste = resultado.some((filme) => filme.id === novoFilme.id)
    if (!filmeJaExiste) resultado.push(novoFilme)
  }
  return resultado
}

function buscarPaginaExplorar(busca: string, genero: number, pagina: number) {
  if (busca.trim()) return buscarFilmes(busca.trim(), pagina)
  if (genero !== 0) return buscarDescobertas([genero], pagina)
  return buscarMaisAvaliados(pagina)
}

function App() {
  const [tela, definirTela] = useState<Screen>('home')
  const [busca, definirBusca] = useState('')
  const [filmeSelecionado, definirFilmeSelecionado] = useState<Filme | null>(null)
  const [listas, definirListas] = useState<ListasDeFilmes>(() => ({ watched: lerLista('watched'), favorites: lerLista('favorites'), toWatch: lerLista('toWatch') }))
  const [filmesInicio, definirFilmesInicio] = useState<Filme[]>([])
  const [filmesRecomendados, definirFilmesRecomendados] = useState<Filme[]>([])
  const [filmesExplorar, definirFilmesExplorar] = useState<Filme[]>([])
  const [carregandoInicio, definirCarregandoInicio] = useState(true)
  const [carregandoExplorar, definirCarregandoExplorar] = useState(false)
  const [carregandoDetalhes, definirCarregandoDetalhes] = useState(false)
  const [erroDetalhes, definirErroDetalhes] = useState(false)
  const [paginaExplorar, definirPaginaExplorar] = useState(1)
  const [totalPaginasExplorar, definirTotalPaginasExplorar] = useState(1)
  const [generoSelecionado, definirGeneroSelecionado] = useState(0)
  const { watched: assistidos, favorites: favoritos, toWatch: queroAssistir } = listas
  const recomendacoesVisiveis = favoritos.length > 0 || assistidos.length > 0 ? filmesRecomendados : []

  useEffect(() => {
    let cancelado = false
    buscarMaisAvaliados(1).then((resultado) => {
      if (!cancelado) definirFilmesInicio(resultado.filmes)
    }).catch(() => {}).finally(() => {
      if (!cancelado) definirCarregandoInicio(false)
    })
    return () => { cancelado = true }
  }, [])

  useEffect(() => {
    let cancelado = false
    const temporizador = window.setTimeout(async () => {
      definirCarregandoExplorar(true)
      definirFilmesExplorar([])
      definirPaginaExplorar(1)
      try {
        const resultado = await buscarPaginaExplorar(busca, generoSelecionado, 1)
        if (!cancelado) {
          definirFilmesExplorar(resultado.filmes)
          definirTotalPaginasExplorar(resultado.totalPaginas)
        }
      } catch {
        if (!cancelado) return
      } finally {
        if (!cancelado) definirCarregandoExplorar(false)
      }
    }, 250)
    return () => { cancelado = true; window.clearTimeout(temporizador) }
  }, [busca, generoSelecionado])

  useEffect(() => {
    let cancelado = false
    let origem = assistidos
    if (favoritos.length > 0) origem = favoritos
    if (origem.length === 0) return
    const contagem: { [id: string]: number } = {}
    origem.forEach((filme) => filme.idsGeneros.forEach((idGenero) => { contagem[idGenero] = (contagem[idGenero] ?? 0) + 1 }))
    let maiorContagem = 0
    for (const idGenero in contagem) {
      if (contagem[idGenero] > maiorContagem) maiorContagem = contagem[idGenero]
    }
    const generosPreferidos: number[] = []
    for (const idGenero in contagem) {
      if (contagem[idGenero] === maiorContagem) generosPreferidos.push(Number(idGenero))
    }
    buscarDescobertas(generosPreferidos.slice(0, 2)).then((resultado) => {
      if (!cancelado) definirFilmesRecomendados(resultado.filmes.slice(0, 10))
    }).catch(() => {})
    return () => { cancelado = true }
  }, [favoritos, assistidos])

  function alternarFilme(filme: ResumoFilme, tipo: TipoLista) {
    const filmeSalvo = transformarEmFilmeSalvo(filme)
    const jaEstaNaLista = listas[tipo].some((item) => item.id === filme.id)
    const novasListas: ListasDeFilmes = { ...listas, watched: [...listas.watched], favorites: [...listas.favorites], toWatch: [...listas.toWatch] }
    if (jaEstaNaLista) {
      novasListas[tipo] = listas[tipo].filter((item) => item.id !== filme.id)
    } else {
      novasListas[tipo].push(filmeSalvo)
    }
    if (!jaEstaNaLista && tipo === 'watched') novasListas.toWatch = novasListas.toWatch.filter((item) => item.id !== filme.id)
    if (!jaEstaNaLista && tipo === 'toWatch') novasListas.watched = novasListas.watched.filter((item) => item.id !== filme.id)

    try {
      salvarListas(novasListas)
      definirListas(novasListas)
    } catch {
      return
    }
  }

  async function selecionarFilme(filme: ResumoFilme) {
    definirTela('detail')
    definirCarregandoDetalhes(true)
    definirErroDetalhes(false)
    definirFilmeSelecionado(null)
    try {
      definirFilmeSelecionado(await buscarDetalhes(filme.id))
    } catch {
      definirErroDetalhes(true)
    } finally {
      definirCarregandoDetalhes(false)
    }
  }

  async function carregarMaisFilmes() {
    if (carregandoExplorar || paginaExplorar >= totalPaginasExplorar) return
    const proximaPagina = paginaExplorar + 1
    definirCarregandoExplorar(true)
    try {
      const resultado = await buscarPaginaExplorar(busca, generoSelecionado, proximaPagina)
      definirFilmesExplorar((atuais) => juntarFilmes(atuais, resultado.filmes))
      definirPaginaExplorar(proximaPagina)
      definirTotalPaginasExplorar(resultado.totalPaginas)
    } catch {
      return
    } finally {
      definirCarregandoExplorar(false)
    }
  }

  function navegar(proximaTela: Screen) {
    definirTela(proximaTela)
    definirFilmeSelecionado(null)
    if (proximaTela !== 'explore') definirBusca('')
  }

  function pesquisar(texto: string) {
    definirBusca(texto)
    definirTela('explore')
  }

  return (
    <div className="app">
      <Header screen={tela} aoNavegar={navegar} busca={busca} aoPesquisar={pesquisar} />
      <main className="main-content">
        {tela === 'home' && (carregandoInicio ? <p className="empty-message">Carregando filmes...</p> : <HomePage filmes={filmesInicio} filmesRecomendados={recomendacoesVisiveis} assistidos={assistidos} favoritos={favoritos} queroAssistir={queroAssistir} aoAlternarAssistido={(filme) => alternarFilme(filme, 'watched')} aoAlternarFavorito={(filme) => alternarFilme(filme, 'favorites')} aoAlternarQueroAssistir={(filme) => alternarFilme(filme, 'toWatch')} aoSelecionar={selecionarFilme} aoExplorar={() => navegar('explore')} />)}
        {tela === 'explore' && <ExplorePage filmes={filmesExplorar} busca={busca} generoSelecionado={generoSelecionado} carregando={carregandoExplorar} temMais={paginaExplorar < totalPaginasExplorar} aoMudarGenero={definirGeneroSelecionado} aoCarregarMais={carregarMaisFilmes} aoSelecionar={selecionarFilme} />}
        {tela === 'lists' && <ListsPage assistidos={assistidos} favoritos={favoritos} queroAssistir={queroAssistir} aoAlternarAssistido={(filme) => alternarFilme(filme, 'watched')} aoAlternarFavorito={(filme) => alternarFilme(filme, 'favorites')} aoAlternarQueroAssistir={(filme) => alternarFilme(filme, 'toWatch')} aoSelecionar={selecionarFilme} />}
        {tela === 'detail' && carregandoDetalhes && <p className="empty-message">Carregando detalhes...</p>}
        {tela === 'detail' && erroDetalhes && <p className="empty-message">Não foi possível carregar este filme.</p>}
        {tela === 'detail' && filmeSelecionado && <DetailPage filme={filmeSelecionado} assistido={assistidos.some((item) => item.id === filmeSelecionado.id)} favorito={favoritos.some((item) => item.id === filmeSelecionado.id)} estaNaLista={queroAssistir.some((item) => item.id === filmeSelecionado.id)} aoAlternarAssistido={() => alternarFilme(filmeSelecionado, 'watched')} aoAlternarFavorito={() => alternarFilme(filmeSelecionado, 'favorites')} aoAlternarQueroAssistir={() => alternarFilme(filmeSelecionado, 'toWatch')} aoVoltar={() => navegar('home')} />}
      </main>
    </div>
  )
}

export default App
