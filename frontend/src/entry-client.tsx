import TagManager from 'react-gtm-module'
import { HelmetProvider } from './utils/helmet'
import { hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const tagManagerArgs = {
  gtmId: 'GTM-MZNNZXH',
}

const scheduleGtmInit = () => {
  TagManager.initialize(tagManagerArgs)
}

if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(scheduleGtmInit, { timeout: 3000 })
  } else {
    globalThis.setTimeout(scheduleGtmInit, 1500)
  }
} else {
  scheduleGtmInit()
}

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
