import { z } from 'zod'
import { userId, user } from '../models/user.models.js'
import { procedure, controller } from '../trpc.js'

export const userController = controller({
  get: procedure
    .input(z.object({
      id: userId,
    }))
    .output(user)
    .query(async ({ input }) => ({
      id: input.id,
    })),
})
