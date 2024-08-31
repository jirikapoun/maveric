import express from 'express'
import { appController } from './controllers/index.js'
import { type Middleware } from './middleware'
import { createTRPCMiddleware } from './middleware/trpc.middleware.js'

export const createApp = (uiMiddleware: Middleware) => {
  const app = express()

  app.use(uiMiddleware)

  app.use((req, _res, next) => {
    console.log('Request:', req.method, req.originalUrl)
    next()
  })

  app.use('/trpc', createTRPCMiddleware(appController))

  return app
}


export default createApp
