import { z } from 'zod'

// Schemas

export const userId = z.number()

export const user = z.object({
  id: userId,
})


// Types

export type UserId = z.infer<typeof userId>

export type User = z.infer<typeof user>
