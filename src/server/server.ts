import { createServer } from 'node:http'
import { createApp } from './app.js'
import uiMiddleware from './middleware/ui.middleware.js'

const port = process.env.PORT || 5173

const app = createApp(uiMiddleware)
const server = createServer(app)

await new Promise(resolve => server.listen(port, resolve as never))

console.log(`Server listening at http://localhost:${port}`)
