import { controller } from '../middleware/trpc.middleware.js'
import { userController } from './user.controller.js'

export const appController = controller({
  user: userController,
})

export type AppController = typeof appController
