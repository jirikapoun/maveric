import fs from 'node:fs/promises'
import sirv from 'sirv'
import { renderToString } from 'react-dom/server'
import { type Middleware } from './base'

const base = process.env.BASE || '/'

const templateHtml = await fs.readFile('../client/index.html', 'utf-8')

// TODO use manifest according to https://vitejs.dev/guide/ssr#generating-preload-directives
// const ssrManifest = isProduction
//   ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
//   : undefined

const serveSource = sirv('../../dist/client', { extensions: [] })

const serveAssets = sirv('../../public', { extensions: [] })

const ssrMiddleware: Middleware = async (req, res) => {
  const url = req.originalUrl.replace(base, '')

  const relativePath = url || 'View'
  const params = {}

  const template = templateHtml.replace('<!--app-js-->', `
        <script type="module">
          import '/views/${relativePath}.js';

          const params = ${JSON.stringify(params)}
          globalThis.loadView(globalThis.View, params);
        </script>
      `)
  const { View } = await import(`../views/${relativePath}.js`)

  const rendered = renderToString(View)

  const html = template
    .replace('<!--app-head-->', '')
    .replace('<!--app-html-->', rendered)

  res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
}

export const uiMiddleware: Middleware = (req, res, next) => {
  serveSource(req, res, () => {
    serveAssets(req, res, () => {
      void ssrMiddleware(req, res, next)
    })
  })
}

export default uiMiddleware
