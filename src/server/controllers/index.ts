import { controller } from '../trpc.js'
import { userController } from './user.controller.js'

export const appController = controller({
  user: userController,
})
