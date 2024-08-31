import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { initTRPC } from '@trpc/server'
import { type AppController } from '../controllers'

const tRPC = initTRPC.create()

export const controller = tRPC.router

export const procedure = tRPC.procedure

export const createTRPCMiddleware = (appController: AppController) => createHTTPHandler({
  router: appController,
})

export default createTRPCMiddleware
