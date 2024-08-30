import { readFile } from 'node:fs/promises'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'
import { type Middleware } from './base'

const base = process.env.BASE || '/'

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  // base,
})

const ssrDevMiddleware: Middleware = async (req, res, _next) => {
  try {
    const url = req.originalUrl.replace(base, '')

    const relativePath = url || 'View'
    const params = {}

    // Always read fresh template in development
    let template = await readFile('./src/ui/index.html', 'utf-8')
    template = template.replace('<!--app-js-->', `
        <script type="module" src="/views/${relativePath}.tsx"></script>
        <!--app-js-->
      `)
    template = await vite.transformIndexHtml(url, template)
    template = template.replace('<!--app-js-->', `
        <script type="module">
          import loadView from '/loader.ts';
          import view from '/views/${relativePath}.tsx';

          const params = ${JSON.stringify(params)};
          loadView(view, params);
        </script>
      `)
    const { View } = await vite.ssrLoadModule(`/views/${relativePath}.tsx`)

    const rendered = renderToString(View)

    const html = template
      .replace('<!--app-head-->', '')
      .replace('<!--app-html-->', rendered)

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e: any) {
    vite.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
}

export const devMiddleware: Middleware = (req, res, next) => {
  vite.middlewares(req, res, () => {
    ssrDevMiddleware(req, res, next)
  })
}

export default devMiddleware
