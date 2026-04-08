import TagManager from 'react-gtm-module'
import { HelmetProvider } from './utils/helmet'
import { hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const tagManagerArgs = {
  gtmId: 'GTM-MZNNZXH',
}

TagManager.initialize(tagManagerArgs)

const container = document.getElementById('root')

if (container) {
  hydrateRoot(
    container,
    <HelmetProvider>
      <App />
    </HelmetProvider>
  )
  window.requestAnimationFrame(() => {
    document.body.classList.add('is-loaded')
  })
}
