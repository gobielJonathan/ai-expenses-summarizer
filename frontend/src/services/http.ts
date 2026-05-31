const BASE_URL = '/api/v1'

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

function buildHeaders(extra?: HeadersInit, isFormData = false): HeadersInit {
  const token = getAuthToken()
  const headers: Record<string, string> = {}
  if (!isFormData) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  return { ...headers, ...(extra as Record<string, string> ?? {}) }
}

export interface ApiWrapper<T> {
  success: boolean
  data: T
  meta?: { total: number; page: number; limit: number; totalPages: number }
  error?: string
  code?: string
}

async function request<T>(path: string, options?: RequestInit & { isFormData?: boolean }): Promise<ApiWrapper<T>> {
  const { isFormData, ...fetchOptions } = options ?? {}
  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers: buildHeaders(fetchOptions.headers, isFormData),
  })

  const body = await res.json().catch(() => ({ success: false, error: 'Invalid response' }))

  if (!res.ok) {
    const message = body.error ?? body.message ?? `HTTP ${res.status}`
    const err = new Error(message) as Error & { status: number }
    err.status = res.status
    throw err
  }

  return body as ApiWrapper<T>
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  postFormData: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: 'POST', body: formData, isFormData: true }),
}
