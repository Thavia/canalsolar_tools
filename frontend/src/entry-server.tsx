import { HelmetProvider } from './utils/helmet'
import type { HelmetServerState } from './utils/helmet'
import { renderToString } from 'react-dom/server'
import App from './App'

type HelmetContext = {
  helmet?: HelmetServerState
}

export function render(url: string) {
  const helmetContext: HelmetContext = {}
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <App pathname={url} />
    </HelmetProvider>
  )

  const { helmet } = helmetContext
  const head = [
    helmet?.title?.toString() ?? '',
    helmet?.meta?.toString() ?? '',
    helmet?.link?.toString() ?? '',
  ].join('')

  return { html, head }
}
