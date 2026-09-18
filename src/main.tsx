import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import Aplicacao, { PaginaNaoEncontrada, RotaDetalhes, RotaExplorar, RotaInicial, RotaListas } from './App'

const roteador = createBrowserRouter([
  {
    path: '/',
    element: <Aplicacao />,
    errorElement: <PaginaNaoEncontrada />,
    children: [
      { index: true, element: <RotaInicial /> },
      { path: 'explorar', element: <RotaExplorar /> },
      { path: 'listas', element: <RotaListas /> },
      { path: 'filme/:id', element: <RotaDetalhes /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={roteador} />
  </StrictMode>,
)
