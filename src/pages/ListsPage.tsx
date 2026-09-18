import { useState } from 'react'
import type { FilmeSalvo } from '../models/movie'
import CartaoFilme from '../components/MovieCard'

type TipoLista = 'assistidos' | 'favoritos' | 'queroAssistir'
type PropriedadesListas = {
  assistidos: FilmeSalvo[]
  favoritos: FilmeSalvo[]
  queroAssistir: FilmeSalvo[]
  onAlternarAssistido: (filme: FilmeSalvo) => void
  onAlternarFavorito: (filme: FilmeSalvo) => void
  onAlternarQueroAssistir: (filme: FilmeSalvo) => void
  onSelecionar: (filme: FilmeSalvo) => void
}

const abas = [
  { chave: 'assistidos', nome: 'Assistidos', icone: 'bx-show' },
  { chave: 'favoritos', nome: 'Favoritos', icone: 'bx-heart' },
  { chave: 'queroAssistir', nome: 'Quero assistir', icone: 'bx-bookmark-plus' },
] as const

function PaginaListas({
  assistidos,
  favoritos,
  queroAssistir,
  onAlternarAssistido,
  onAlternarFavorito,
  onAlternarQueroAssistir,
  onSelecionar,
}: PropriedadesListas) {
  const [abaAtiva, definirAbaAtiva] = useState<TipoLista>('assistidos')
  const listas = { assistidos, favoritos, queroAssistir }
  const listaAtiva = listas[abaAtiva]
  const onRemover = { assistidos: onAlternarAssistido, favoritos: onAlternarFavorito, queroAssistir: onAlternarQueroAssistir }

  return (
    <section className="conteudo-pagina">
      <p className="subtitulo">Sua colecao</p>
      <h1>Minhas listas</h1>

      <div className="abas" role="group" aria-label="Minhas listas">
        {abas.map((aba) => (
          <button
            className={`aba ${aba.chave === 'favoritos' ? 'favorito' : ''} ${abaAtiva === aba.chave ? 'ativo' : ''}`}
            key={aba.chave}
            type="button"
            aria-pressed={abaAtiva === aba.chave}
            onClick={() => definirAbaAtiva(aba.chave)}
          >
            <i className={`bx ${aba.icone}`} aria-hidden="true" /> {aba.nome} ({listas[aba.chave].length})
          </button>
        ))}
      </div>

      {listaAtiva.length > 0
        ? (
          <section className="grade-filmes" aria-label="Filmes da lista selecionada">
            {listaAtiva.map((filme) => (
              <CartaoFilme
                key={filme.id}
                filme={filme}
                onSelecionar={onSelecionar}
                onRemover={() => onRemover[abaAtiva](filme)}
              />
            ))}
          </section>
        )
        : <p className="mensagem-vazia">Sua lista esta vazia</p>}
    </section>
  )
}

export default PaginaListas
