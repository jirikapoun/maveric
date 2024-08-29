import fs from 'node:fs/promises'
import express from 'express'
import ReactDOMServer from 'react-dom/server'

const createRender = app => ({
  render: () => {
    const html = ReactDOMServer.renderToString(app)
    return { html }
  },
})

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite

if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const sirv = (await import('sirv')).default
  app.use(base, sirv('./dist/client', { extensions: [] }))
  app.use(base, sirv('./public', { extensions: [] }))
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    const relativePath = url || 'View'
    const params = {}

    let template
    let render

    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./src/ui/index.html', 'utf-8')
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
      const view = await vite.ssrLoadModule(`/views/${relativePath}.tsx`)
      render = createRender(view.View).render
    } else {
      template = templateHtml.replace('<!--app-js-->', `
        <script type="module">
          import '/views/${relativePath}.js';

          const params = ${JSON.stringify(params)}
          globalThis.loadView(globalThis.View, params);
        </script>
      `)
      const { View } = await import(`./dist/server/views/${relativePath}.js`)
      render = createRender(View).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
