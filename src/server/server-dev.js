import { createServer } from 'vite'

const port = Number(process.env.PORT) || 5173

const serverVite = await createServer({
  configFile: './vite.config.ts',
  root: '.',
  build: {
    ssr: './app.ts',
    rollupOptions: {
      input: './app.ts',
    },
  },
})

const uiVite = await createServer({
  configFile: '../ui/vite.config.ts',
  root: '../ui',
})

uiVite.middlewares.use(async (req, res) => {
  const { uiDevMiddleware } = await serverVite.ssrLoadModule('/middleware/ui-dev.middleware')
  const { createApp } = await serverVite.ssrLoadModule('/app')

  const middleware = uiDevMiddleware(uiVite)
  const app = createApp(middleware)

  app(req, res)
})

await uiVite.listen(port)

console.log(`Dev server listening at http://localhost:${port}`)
