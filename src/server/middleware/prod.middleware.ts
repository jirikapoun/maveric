import fs from 'node:fs/promises'
import sirv from 'sirv'
import { renderToString } from 'react-dom/server'
import { type Middleware } from './base'

const base = process.env.BASE || '/'

const serveBundle = sirv('./dist/client', { extensions: [] })

const servePublic = sirv('./public', { extensions: [] })

const templateHtml = await fs.readFile('./dist/client/index.html', 'utf-8')

const ssrProdMiddleware: Middleware = async (req, res) => {
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

export const prodMiddleware: Middleware = (req, res, next) => {
  serveBundle(req, res, () => {
    servePublic(req, res, () => {
      ssrProdMiddleware(req, res, next)
    })
  })
}

export default prodMiddleware
