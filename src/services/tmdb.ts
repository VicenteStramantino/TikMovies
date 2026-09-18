import type { Filme, ResumoFilme } from '../models/movie'
import type { FilmeDaApi, RespostaGenerosDaApi, RespostaListaDaApi } from '../models/tmdb'

const ENDERECO_API = 'https://api.themoviedb.org/3'
const ENDERECO_IMAGENS = 'https://image.tmdb.org/t/p'
const CHAVE_API = import.meta.env.VITE_TMDB_API_TOKEN

const nomesDosGeneros: { [id: number]: string } = {}

function criarEnderecoDaImagem(caminho: string | null | undefined, tamanho: 'w500' | 'w1280') {
  if (!caminho) return ''
  return `${ENDERECO_IMAGENS}/${tamanho}${caminho}`
}

async function buscarNaApi<T>(caminho: string): Promise<T> {
  if (!CHAVE_API) throw new Error('Chave do TMDB nao configurada')

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

  const resposta = await buscarNaApi<RespostaGenerosDaApi>('/genre/movie/list?language=pt-BR')
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
    descricao: filme.overview || 'Este filme ainda nao possui uma descricao em portugues.',
    fundo: criarEnderecoDaImagem(filme.backdrop_path, 'w1280') || criarEnderecoDaImagem(filme.poster_path, 'w1280'),
    plataformas: buscarPlataformas(filme),
    orcamento: filme.budget ?? 0,
    produtores: buscarProdutores(filme),
  }
}

async function buscarLista(caminho: string) {
  const resposta = await buscarNaApi<RespostaListaDaApi>(caminho)
  const nomesGeneros = await buscarNomesDosGeneros()
  const filmes = resposta.results.map((filme) => transformarEmFilme(filme, nomesGeneros))

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
