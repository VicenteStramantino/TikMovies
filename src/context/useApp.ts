import { useContext } from 'react'
import { ContextoAplicacao } from './context'

export function useAplicacao() {
  const contexto = useContext(ContextoAplicacao)

  if (!contexto) throw new Error('useAplicacao precisa ser usado dentro de ProvedorAplicacao')

  return contexto
}
