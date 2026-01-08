import React from 'react'
import ReactDOM from 'react-dom/client'
import TagManager from 'react-gtm-module'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'



const tagManagerArgs = {
  gtmId: 'GTM-MZNNZXH'
}

TagManager.initialize(tagManagerArgs)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)

