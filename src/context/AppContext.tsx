import { useEffect, useState, type ReactNode } from 'react'
import type { Filme, FilmeSalvo, ResumoFilme } from '../models/movie'
import { buscarDescobertas, buscarFilmes, buscarMaisAvaliados } from '../services/tmdb'
import { ContextoAplicacao, type TipoLista } from './context'

type ListasDeFilmes = {
  assistidos: FilmeSalvo[]
  favoritos: FilmeSalvo[]
  queroAssistir: FilmeSalvo[]
}

const nomesAntigosDasListas = {
  assistidos: 'watched',
  favoritos: 'favorites',
  queroAssistir: 'toWatch',
}
function lerLista(tipo: TipoLista): FilmeSalvo[] {
  try {
    const valor = localStorage.getItem(`tikmovies-${nomesAntigosDasListas[tipo]}`)
    return valor ? JSON.parse(valor) as FilmeSalvo[] : []
  } catch {
    return []
  }
}

function salvarListas(listas: ListasDeFilmes) {
  localStorage.setItem('tikmovies-watched', JSON.stringify(listas.assistidos))
  localStorage.setItem('tikmovies-favorites',JSON.stringify(listas.favoritos))
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

export function ProvedorAplicacao({ filhos }: { filhos: ReactNode }) {
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

  const assistidos = listas.assistidos
  const favoritos = listas.favoritos
  const queroAssistir = listas.queroAssistir
  const temMais = paginaExplorar < totalPaginasExplorar
  const filmesRecomendadosVisiveis = favoritos.length > 0 || assistidos.length > 0 ? filmesRecomendados : []

  useEffect(() => {
    try {
      salvarListas(listas)
    } catch {
      // O aplicativo continua funcionando mesmo sem o localStorage.
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
        return
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

    origem.forEach((filme) => {
      filme.idsGeneros.forEach((idGenero) => {
        contagem[idGenero] = (contagem[idGenero] ?? 0) + 1
      })
    })

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
        ...listasAtuais,
        [tipo]: jaEstaNaLista
          ? listasAtuais[tipo].filter((item) => item.id !== filme.id)
          : [...listasAtuais[tipo], filmeSalvo],
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
      return
    } finally {
      definirCarregandoExplorar(false)
    }
  }

  const valor = {
    busca,
    definirBusca,
    generoSelecionado,
    definirGeneroSelecionado,
    assistidos,
    favoritos,
    queroAssistir,
    filmesInicio,
    filmesRecomendados: filmesRecomendadosVisiveis,
    filmesExplorar,
    carregandoInicio,
    erroInicio,
    carregandoExplorar,
    erroExplorar,
    temMais,
    alternarFilme,
    carregarMaisFilmes,
  }

  return <ContextoAplicacao.Provider value={valor}>{filhos}</ContextoAplicacao.Provider>
}
