import express from 'express'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { appController } from './controllers/index.js'
import { type Middleware } from './middleware'

export const createApp = (uiMiddleware: Middleware) => {
  const app = express()

  app.use(uiMiddleware)

  app.use((req, _res, next) => {
    console.log('Request:', req.method, req.originalUrl)
    next()
  })

  app.use('/trpc', createHTTPHandler({
    router: appController,
  }))

  return app
}


export default createApp
