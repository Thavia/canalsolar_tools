import 'dotenv/config'
import express from 'express'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const port = Number(process.env.PORT) || 3004
const root = __dirname
const distClientIndex = path.resolve(root, 'dist/client/index.html')
const isProd =
  process.env.NODE_ENV === 'production' ||
  (process.env.NODE_ENV !== 'development' && existsSync(distClientIndex))

const app = express()
let renderPreloadLinks = () => ''

if (!isProd) {
  const { createServer } = await import('vite')
  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  })

  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template = await fs.readFile(path.resolve(root, 'index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
      const { html, head } = await render(url)
      const htmlResponse = template
        .replace('<!--app-head-->', head)
        .replace('<!--app-html-->', html)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlResponse)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      res.status(500).end(error.message)
    }
  })
} else {
  const distClient = path.resolve(root, 'dist/client')
  const distServer = path.resolve(root, 'dist/server')
  const template = await fs.readFile(path.resolve(distClient, 'index.html'), 'utf-8')
  const serverAssetsDir = path.join(distServer, 'assets')
  const serverAssets = await fs.readdir(serverAssetsDir)
  const entryServerFile = serverAssets.find(
    (file) => file.startsWith('entry-server-') && file.endsWith('.js')
  )

  if (!entryServerFile) {
    throw new Error('SSR bundle not found. Expected entry-server-*.js in dist/server/assets.')
  }

  const entryServerUrl = pathToFileURL(path.join(serverAssetsDir, entryServerFile)).href
  const { render } = await import(entryServerUrl)
  const manifestPath = path.resolve(distClient, '.vite/manifest.json')
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'))

  renderPreloadLinks = (entry) => {
    const seen = new Set()
    const styles = new Set()
    const modules = new Set()
    const fonts = new Set()

    const walk = (key) => {
      if (seen.has(key)) return
      const item = manifest[key]
      if (!item) return
      seen.add(key)
      if (item.css) {
        item.css.forEach((css) => styles.add(css))
      }
      if (item.assets) {
        item.assets.forEach((asset) => {
          if (asset.match(/\.(woff2?|ttf|otf)(\?.*)?$/i)) {
            fonts.add(asset)
          }
        })
      }
      if (item.file) {
        modules.add(item.file)
      }
      if (item.imports) {
        item.imports.forEach(walk)
      }
    }

    walk(entry)

    const styleLinks = Array.from(styles)
      .map((href) => {
        const url = `/${href}`
        return [
          `<link rel="preload" href="${url}" as="style">`,
          `<link rel="stylesheet" href="${url}" media="print" onload="this.media='all'">`,
          `<noscript><link rel="stylesheet" href="${url}"></noscript>`,
        ].join('')
      })
      .join('')
    const fontLinks = Array.from(fonts)
      .map(
        (href) =>
          `<link rel="preload" href="/${href}" as="font" type="font/${path.extname(href).slice(1)}" crossorigin>`
      )
      .join('')
    const moduleLinks = Array.from(modules)
      .map((href) => `<link rel="modulepreload" href="/${href}">`)
      .join('')

    return styleLinks + fontLinks + moduleLinks
  }

  app.use(
    express.static(distClient, {
      index: false,
      maxAge: '1y',
      immutable: true,
    })
  )

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      const { html, head } = await render(url)
      const preloadLinks = renderPreloadLinks('src/entry-client.tsx')
      const htmlResponse = template
        .replace('<!--app-head-->', `${preloadLinks}${head}`)
        .replace('<!--app-html-->', html)
      res
        .status(200)
        .set({
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store',
        })
        .end(htmlResponse)
    } catch (error) {
      res.status(500).end('Server error')
    }
  })
}

app.listen(port, () => {
  console.log(`SSR server running on http://localhost:${port}`)
})
