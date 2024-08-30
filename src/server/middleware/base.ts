// import { type IncomingMessage, type ServerResponse } from 'node:http'
// import { type NextHandler } from 'sirv'
import { type Request, type Response, type NextFunction } from 'express'

// export type Middleware = (req: IncomingMessage, res: ServerResponse, next: NextHandler) => void
export type Middleware = (req: Request, res: Response, next: NextFunction) => void
