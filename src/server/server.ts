import express from 'express'
import { type Middleware } from './middleware/base'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173

// TODO use manifest according to https://vitejs.dev/guide/ssr#generating-preload-directives
// const ssrManifest = isProduction
//   ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
//   : undefined

// Create http server
const app = express()

// Environment-specific functionality
const env = isProduction ? 'prod' : 'dev'
const envMiddleware = await import(`./middleware/${env}.middleware.js`) as { default: Middleware }
app.use(envMiddleware.default)

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
