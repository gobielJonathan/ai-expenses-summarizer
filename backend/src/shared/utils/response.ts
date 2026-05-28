import { Response } from 'express'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
  meta?: Record<string, unknown>
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: Record<string, unknown>,
): Response {
  const body: ApiResponse<T> = { success: true, data, message }
  if (meta) body.meta = meta
  return res.status(statusCode).json(body)
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  code?: string,
): Response {
  const body: ApiResponse = { success: false, error: message, code }
  return res.status(statusCode).json(body)
}

export function sendCreated<T>(res: Response, data: T, message?: string): Response {
  return sendSuccess(res, data, message, 201)
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
): Response {
  return sendSuccess(res, data, undefined, 200, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
