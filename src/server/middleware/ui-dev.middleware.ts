import { readFile } from 'node:fs/promises'
import { renderToString } from 'react-dom/server'
import { type ViteDevServer } from 'vite'
import { type Middleware } from './index'

const base = process.env.BASE || '/'

export const uiDevMiddleware = (vite: ViteDevServer): Middleware => async (req, res, next) => {
  try {
    const url = req.originalUrl.replace(base, '')
    if (url.startsWith('trpc/')) {
      return next()
    }

    const relativePath = url || 'View'
    const params = {}

    // Always read fresh template in development
    let template = await readFile('../ui/index.html', 'utf-8')
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    vite.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
}

export default uiDevMiddleware
