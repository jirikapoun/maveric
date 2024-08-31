import { initTRPC } from '@trpc/server'

const trpc = initTRPC.create()

export const controller = trpc.router

export const procedure = trpc.procedure
