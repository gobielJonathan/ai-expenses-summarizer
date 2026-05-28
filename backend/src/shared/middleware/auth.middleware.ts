import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { UnauthorizedError } from '../errors'

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string }
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid Authorization header'))
  }

  const token = authHeader.slice(7)
  try {
    const payload = verifyToken(token)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    next(new UnauthorizedError('Invalid or expired token'))
  }
}
