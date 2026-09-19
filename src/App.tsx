import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext, useParams } from 'react-router'
import 'boxicons/css/boxicons.min.css'
import Cabecalho from './components/Header'
import PaginaDetalhes from './pages/DetailPage'
import PaginaExplorar from './pages/ExplorePage'
import PaginaInicial from './pages/HomePage'
import PaginaListas from './pages/ListsPage'
import { buscarDescobertas, buscarDetalhes, buscarFilmes, buscarMaisAvaliados } from './services/tmdb'
import type { Filme, FilmeSalvo, ResumoFilme } from './models/movie'
import './App.css'

export type TipoLista = 'assistidos' | 'favoritos' | 'queroAssistir'

type ListasDeFilmes = {
  assistidos: FilmeSalvo[]
  favoritos: FilmeSalvo[]
  queroAssistir: FilmeSalvo[]
}

export type DadosDaAplicacao = {
  busca: string
  definirBusca: (texto: string) => void
  generoSelecionado: number
  definirGeneroSelecionado: (idGenero: number) => void
  assistidos: FilmeSalvo[]
  favoritos: FilmeSalvo[]
  queroAssistir: FilmeSalvo[]
  filmesInicio: Filme[]
  filmesRecomendados: Filme[]
  filmesExplorar: Filme[]
  carregandoInicio: boolean
  erroInicio: boolean
  carregandoExplorar: boolean
  erroExplorar: boolean
  temMais: boolean
  alternarFilme: (filme: ResumoFilme, tipo: TipoLista) => void
  carregarMaisFilmes: () => Promise<void>
}

const nomesAntigosDasListas = {
  assistidos: 'watched',
  favoritos: 'favorites',
  queroAssistir: 'toWatch',
}

function lerLista(tipo: TipoLista): FilmeSalvo[] {
  try {
    const nomeAntigo = nomesAntigosDasListas[tipo]
    const valor = localStorage.getItem(`tikmovies-${nomeAntigo}`)
    return valor ? JSON.parse(valor) as FilmeSalvo[] : []
  } catch {
    return []
  }
}

function salvarListas(listas: ListasDeFilmes) {
  localStorage.setItem('tikmovies-watched', JSON.stringify(listas.assistidos))
  localStorage.setItem('tikmovies-favorites', JSON.stringify(listas.favoritos))
  localStorage.setItem('tikmovies-toWatch', JSON.stringify(listas.queroAssistir))
}

function transformarEmFilmeSalvo(filme: ResumoFilme): FilmeSalvo {
  return {
    id: filme.id,
    titulo: filme.titulo,
    anoLancamento: filme.anoLancamento,
    poster: filme.poster,
    idsGeneros: filme.idsGeneros,
  }
}

function juntarFilmes(filmesAtuais: Filme[], filmesNovos: Filme[]) {
  const resultado = [...filmesAtuais]

  for (const filmeNovo of filmesNovos) {
    const filmeJaExiste = resultado.some((filme) => filme.id === filmeNovo.id)
    if (!filmeJaExiste) resultado.push(filmeNovo)
  }

  return resultado
}

function buscarPaginaExplorar(busca: string, genero: number, pagina: number) {
  if (busca.trim()) return buscarFilmes(busca.trim(), pagina)
  if (genero !== 0) return buscarDescobertas([genero], pagina)
  return buscarMaisAvaliados(pagina)
}

function Aplicacao() {
  const [busca, definirBusca] = useState('')
  const [generoSelecionado, definirGeneroSelecionado] = useState(0)
  const [listas, definirListas] = useState<ListasDeFilmes>(() => ({
    assistidos: lerLista('assistidos'),
    favoritos: lerLista('favoritos'),
    queroAssistir: lerLista('queroAssistir'),
  }))
  const [filmesInicio, definirFilmesInicio] = useState<Filme[]>([])
  const [filmesRecomendados, definirFilmesRecomendados] = useState<Filme[]>([])
  const [filmesExplorar, definirFilmesExplorar] = useState<Filme[]>([])
  const [carregandoInicio, definirCarregandoInicio] = useState(true)
  const [erroInicio, definirErroInicio] = useState(false)
  const [carregandoExplorar, definirCarregandoExplorar] = useState(false)
  const [erroExplorar, definirErroExplorar] = useState(false)
  const [paginaExplorar, definirPaginaExplorar] = useState(1)
  const [totalPaginasExplorar, definirTotalPaginasExplorar] = useState(1)
  const navegar = useNavigate()

  const assistidos = listas.assistidos
  const favoritos = listas.favoritos
  const queroAssistir = listas.queroAssistir
  const temMais = paginaExplorar < totalPaginasExplorar
  let recomendacoesVisiveis = filmesRecomendados
  if (favoritos.length === 0 && assistidos.length === 0) recomendacoesVisiveis = []

  useEffect(() => {
    try {
      salvarListas(listas)
    } catch {
    }
  }, [listas])

  useEffect(() => {
    buscarMaisAvaliados(1)
      .then((resultado) => definirFilmesInicio(resultado.filmes))
      .catch(() => definirErroInicio(true))
      .finally(() => definirCarregandoInicio(false))
  }, [])

  useEffect(() => {
    const temporizador = window.setTimeout(async () => {
      definirCarregandoExplorar(true)
      definirErroExplorar(false)
      definirFilmesExplorar([])
      definirPaginaExplorar(1)

      try {
        const resultado = await buscarPaginaExplorar(busca, generoSelecionado, 1)
        definirFilmesExplorar(resultado.filmes)
        definirTotalPaginasExplorar(resultado.totalPaginas)
      } catch {
        definirErroExplorar(true)
      } finally {
        definirCarregandoExplorar(false)
      }
    }, 250)

    return () => window.clearTimeout(temporizador)
  }, [busca, generoSelecionado])

  useEffect(() => {
    let origem = assistidos
    if (favoritos.length > 0) origem = favoritos
    if (origem.length === 0) return

    const contagem: { [id: string]: number } = {}
    for (const filme of origem) {
      for (const idGenero of filme.idsGeneros) {
        if (!contagem[idGenero]) contagem[idGenero] = 0
        contagem[idGenero] += 1
      }
    }

    let maiorContagem = 0
    for (const idGenero in contagem) {
      if (contagem[idGenero] > maiorContagem) maiorContagem = contagem[idGenero]
    }

    const generosPreferidos: number[] = []
    for (const idGenero in contagem) {
      if (contagem[idGenero] === maiorContagem) generosPreferidos.push(Number(idGenero))
    }

    buscarDescobertas(generosPreferidos.slice(0, 2))
      .then((resultado) => definirFilmesRecomendados(resultado.filmes.slice(0, 10)))
      .catch(() => undefined)
  }, [favoritos, assistidos])

  function alternarFilme(filme: ResumoFilme, tipo: TipoLista) {
    definirListas((listasAtuais) => {
      const filmeSalvo = transformarEmFilmeSalvo(filme)
      const jaEstaNaLista = listasAtuais[tipo].some((item) => item.id === filme.id)
      const novasListas: ListasDeFilmes = {
        assistidos: [...listasAtuais.assistidos],
        favoritos: [...listasAtuais.favoritos],
        queroAssistir: [...listasAtuais.queroAssistir],
      }

      if (jaEstaNaLista) {
        novasListas[tipo] = listasAtuais[tipo].filter((item) => item.id !== filme.id)
      } else {
        novasListas[tipo].push(filmeSalvo)
      }

      if (!jaEstaNaLista && tipo === 'assistidos') {
        novasListas.queroAssistir = novasListas.queroAssistir.filter((item) => item.id !== filme.id)
      }

      if (!jaEstaNaLista && tipo === 'queroAssistir') {
        novasListas.assistidos = novasListas.assistidos.filter((item) => item.id !== filme.id)
      }

      return novasListas
    })
  }

  async function carregarMaisFilmes() {
    if (carregandoExplorar || !temMais) return

    const proximaPagina = paginaExplorar + 1
    definirCarregandoExplorar(true)

    try {
      const resultado = await buscarPaginaExplorar(busca, generoSelecionado, proximaPagina)
      definirFilmesExplorar((atuais) => juntarFilmes(atuais, resultado.filmes))
      definirPaginaExplorar(proximaPagina)
      definirTotalPaginasExplorar(resultado.totalPaginas)
    } catch {
      definirErroExplorar(true)
    } finally {
      definirCarregandoExplorar(false)
    }
  }

  function pesquisar(texto: string) {
    definirBusca(texto)
    navegar('/explorar')
  }

  const dados: DadosDaAplicacao = {
    busca,
    definirBusca,
    generoSelecionado,
    definirGeneroSelecionado,
    assistidos,
    favoritos,
    queroAssistir,
    filmesInicio,
    filmesRecomendados: recomendacoesVisiveis,
    filmesExplorar,
    carregandoInicio,
    erroInicio,
    carregandoExplorar,
    erroExplorar,
    temMais,
    alternarFilme,
    carregarMaisFilmes,
  }

  return (
    <div className="aplicativo">
      <Cabecalho busca={busca} onPesquisar={pesquisar} />
      <main className="conteudo-principal">
        <Outlet context={dados} />
      </main>
    </div>
  )
}

export function RotaInicial() {
  const dados = useOutletContext<DadosDaAplicacao>()
  const navegar = useNavigate()

  function selecionarFilme(filme: ResumoFilme) {
    navegar(`/filme/${filme.id}`)
  }

  return (
    <PaginaInicial
      filmes={dados.filmesInicio}
      filmesRecomendados={dados.filmesRecomendados}
      erroCarregamento={dados.erroInicio}
      assistidos={dados.assistidos}
      favoritos={dados.favoritos}
      queroAssistir={dados.queroAssistir}
      onAlternarAssistido={(filme) => dados.alternarFilme(filme, 'assistidos')}
      onAlternarFavorito={(filme) => dados.alternarFilme(filme, 'favoritos')}
      onAlternarQueroAssistir={(filme) => dados.alternarFilme(filme, 'queroAssistir')}
      onSelecionar={selecionarFilme}
      onExplorar={() => navegar('/explorar')}
    />
  )
}

export function RotaExplorar() {
  const dados = useOutletContext<DadosDaAplicacao>()
  const navegar = useNavigate()

  function selecionarFilme(filme: ResumoFilme) {
    navegar(`/filme/${filme.id}`)
  }

  return (
    <PaginaExplorar
      filmes={dados.filmesExplorar}
      busca={dados.busca}
      generoSelecionado={dados.generoSelecionado}
      carregando={dados.carregandoExplorar}
      erro={dados.erroExplorar}
      temMais={dados.temMais}
      onMudarGenero={dados.definirGeneroSelecionado}
      onCarregarMais={dados.carregarMaisFilmes}
      onSelecionar={selecionarFilme}
    />
  )
}

export function RotaListas() {
  const dados = useOutletContext<DadosDaAplicacao>()
  const navegar = useNavigate()

  function selecionarFilme(filme: ResumoFilme) {
    navegar(`/filme/${filme.id}`)
  }

  return (
    <PaginaListas
      assistidos={dados.assistidos}
      favoritos={dados.favoritos}
      queroAssistir={dados.queroAssistir}
      onAlternarAssistido={(filme) => dados.alternarFilme(filme, 'assistidos')}
      onAlternarFavorito={(filme) => dados.alternarFilme(filme, 'favoritos')}
      onAlternarQueroAssistir={(filme) => dados.alternarFilme(filme, 'queroAssistir')}
      onSelecionar={selecionarFilme}
    />
  )
}

export function RotaDetalhes() {
  const { id } = useParams()
  const navegar = useNavigate()
  const dados = useOutletContext<DadosDaAplicacao>()
  const numeroId = Number(id)
  const idValido = id !== undefined && !Number.isNaN(numeroId)
  const [resultado, definirResultado] = useState<{ id: number; filme: Filme | null; erro: boolean } | null>(null)

  useEffect(() => {
    if (!idValido) return

    buscarDetalhes(numeroId)
      .then((filme) => definirResultado({ id: numeroId, filme, erro: false }))
      .catch(() => definirResultado({ id: numeroId, filme: null, erro: true }))
  }, [idValido, numeroId])

  if (!idValido) return <p className="mensagem-vazia">Nao foi possivel carregar este filme.</p>
  if (!resultado || resultado.id !== numeroId) return <p className="mensagem-vazia">Carregando detalhes...</p>
  if (resultado.erro || !resultado.filme) return <p className="mensagem-vazia">Nao foi possivel carregar este filme.</p>

  const filme = resultado.filme

  return (
    <PaginaDetalhes
      filme={filme}
      assistido={dados.assistidos.some((item) => item.id === filme.id)}
      favorito={dados.favoritos.some((item) => item.id === filme.id)}
      estaNaLista={dados.queroAssistir.some((item) => item.id === filme.id)}
      onAlternarAssistido={() => dados.alternarFilme(filme, 'assistidos')}
      onAlternarFavorito={() => dados.alternarFilme(filme, 'favoritos')}
      onAlternarQueroAssistir={() => dados.alternarFilme(filme, 'queroAssistir')}
      onVoltar={() => navegar(-1)}
    />
  )
}

export function PaginaNaoEncontrada() {
  return <p className="mensagem-vazia">Pagina nao encontrada.</p>
}

export default Aplicacao
