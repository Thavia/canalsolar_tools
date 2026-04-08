import CursoHomerSamPage from './LPs/CursoHomerSamPage'
import CursoOnlineHidrogenioVerdePage from './LPs/CursoOnlineHidrogenioVerdePage'
import DiagnosticoECEPage from './LPs/DiagnosticoECEPage'
import LandingPage from './LPs/LandingPage'
import NotFoundPage from './LPs/NotFoundPage'
import SimuladorFioBPage from './LPs/SimuladorFioBPage'


type RouteEntry = {
  path: string
  element: JSX.Element
}

const routes: RouteEntry[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/calculadora', element: <SimuladorFioBPage /> },
  { path: '/curso-online-hidrogenio-verde', element: <CursoOnlineHidrogenioVerdePage /> },
  { path: '/curso-online-homer-sam', element: <CursoHomerSamPage /> },
  { path: '/diagnostico-ece', element: <DiagnosticoECEPage /> },
  { path: '/404', element: <NotFoundPage /> },
]

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

function App({ pathname }: { pathname?: string }) {
  const currentPath =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
  const normalizedPath = normalizePath(currentPath)
  const match = routes.find((route) => route.path === normalizedPath)
  return (
    <div className="page-transition" key={normalizedPath}>
      {match?.element ?? <NotFoundPage />}
    </div>
  )
}

export default App





