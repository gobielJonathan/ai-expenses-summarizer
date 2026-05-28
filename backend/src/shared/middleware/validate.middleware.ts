import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

type Target = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      const message = result.error.issues.map((e) => `${e.path.map(String).join('.')}: ${e.message}`).join(', ')
      return next({ statusCode: 400, message, code: 'VALIDATION_ERROR' })
    }
    if (target === 'body') {
      req.body = result.data
    } else {
      Object.defineProperty(req, target, {
        value: result.data,
        writable: true,
        configurable: true,
      })
    }
    next()
  }
}
