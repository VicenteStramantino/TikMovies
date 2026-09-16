import type { Filme, ResumoFilme } from '../data/movies'

const ENDERECO_API = 'https://api.themoviedb.org/3'
const ENDERECO_IMAGENS = 'https://image.tmdb.org/t/p'
const CHAVE_API = import.meta.env.VITE_TMDB_API_TOKEN

type FilmeDaApi = {
  id: number
  title: string
  release_date?: string
  vote_average?: number
  genre_ids?: number[]
  genres?: { id: number; name: string }[]
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  budget?: number
  credits?: { crew?: { job: string; name: string }[] }
  'watch/providers'?: {
    results?: {
      BR?: { flatrate?: { provider_id: number; provider_name: string }[] }
    }
  }
}

type RespostaLista = {
  results: FilmeDaApi[]
  total_pages: number
}

type RespostaGeneros = {
  genres: { id: number; name: string }[]
}

const nomesDosGeneros: { [id: number]: string } = {}

function criarEnderecoDaImagem(caminho: string | null | undefined, tamanho: 'w500' | 'w1280') {
  if (!caminho) return ''
  return `${ENDERECO_IMAGENS}/${tamanho}${caminho}`
}

async function buscarNaApi<T>(caminho: string): Promise<T> {
  if (!CHAVE_API) throw new Error('Chave do TMDB não configurada')

  const resposta = await fetch(`${ENDERECO_API}${caminho}`, {
    headers: {
      Authorization: `Bearer ${CHAVE_API}`,
      accept: 'application/json',
    },
  })

  if (!resposta.ok) throw new Error(`Erro TMDB: ${resposta.status}`)
  return resposta.json() as Promise<T>
}

async function buscarNomesDosGeneros() {
  if (Object.keys(nomesDosGeneros).length > 0) return nomesDosGeneros

  const resposta = await buscarNaApi<RespostaGeneros>('/genre/movie/list?language=pt-BR')
  for (const genero of resposta.genres) {
    nomesDosGeneros[genero.id] = genero.name
  }
  return nomesDosGeneros
}

function transformarEmResumo(filme: FilmeDaApi): ResumoFilme {
  let ano = 0
  if (filme.release_date) ano = Number(filme.release_date.slice(0, 4))

  let idsGeneros: number[] = []
  if (filme.genre_ids) idsGeneros = filme.genre_ids
  if (filme.genres) idsGeneros = filme.genres.map((genero) => genero.id)

  return {
    id: filme.id,
    titulo: filme.title,
    anoLancamento: ano,
    idsGeneros,
    poster: criarEnderecoDaImagem(filme.poster_path, 'w500'),
  }
}

function buscarProdutores(filme: FilmeDaApi) {
  const produtores: string[] = []
  const equipe = filme.credits?.crew ?? []

  for (const pessoa of equipe) {
    const eProdutor = pessoa.job === 'Producer' || pessoa.job === 'Executive Producer'
    if (eProdutor && !produtores.includes(pessoa.name) && produtores.length < 4) {
      produtores.push(pessoa.name)
    }
  }
  return produtores
}

function buscarPlataformas(filme: FilmeDaApi) {
  const plataformas: string[] = []
  const lista = filme['watch/providers']?.results?.BR?.flatrate ?? []

  for (const plataforma of lista) {
    if (!plataformas.includes(plataforma.provider_name)) {
      plataformas.push(plataforma.provider_name)
    }
  }
  return plataformas
}

function transformarEmFilme(filme: FilmeDaApi, nomesGeneros: { [id: number]: string }): Filme {
  const resumo = transformarEmResumo(filme)
  const generos: string[] = []

  for (const idGenero of resumo.idsGeneros) {
    if (nomesGeneros[idGenero]) generos.push(nomesGeneros[idGenero])
  }

  return {
    ...resumo,
    avaliacao: Number((filme.vote_average ?? 0).toFixed(1)),
    generos,
    descricao: filme.overview || 'Este filme ainda não possui uma descrição em português.',
    fundo: criarEnderecoDaImagem(filme.backdrop_path, 'w1280') || criarEnderecoDaImagem(filme.poster_path, 'w1280'),
    plataformas: buscarPlataformas(filme),
    orcamento: filme.budget ?? 0,
    produtores: buscarProdutores(filme),
  }
}

async function buscarLista(caminho: string) {
  const resposta = await buscarNaApi<RespostaLista>(caminho)
  const nomesGeneros = await buscarNomesDosGeneros()
  const filmes: Filme[] = []

  for (const filme of resposta.results) {
    filmes.push(transformarEmFilme(filme, nomesGeneros))
  }

  return {
    filmes,
    totalPaginas: resposta.total_pages,
  }
}

export function buscarMaisAvaliados(pagina = 1) {
  return buscarLista(`/movie/top_rated?language=pt-BR&region=BR&page=${pagina}`)
}

export function buscarFilmes(consulta: string, pagina = 1) {
  const texto = encodeURIComponent(consulta)
  return buscarLista(`/search/movie?language=pt-BR&region=BR&include_adult=false&query=${texto}&page=${pagina}`)
}

export function buscarDescobertas(idsGeneros: number[], pagina = 1) {
  let filtroDeGeneros = ''
  if (idsGeneros.length > 0) filtroDeGeneros = `&with_genres=${idsGeneros.join(',')}`
  return buscarLista(`/discover/movie?language=pt-BR&region=BR&sort_by=popularity.desc&page=${pagina}${filtroDeGeneros}`)
}

export async function buscarDetalhes(id: number) {
  const filme = await buscarNaApi<FilmeDaApi>(`/movie/${id}?language=pt-BR&append_to_response=credits,watch/providers`)
  const nomesGeneros = await buscarNomesDosGeneros()
  return transformarEmFilme(filme, nomesGeneros)
}
