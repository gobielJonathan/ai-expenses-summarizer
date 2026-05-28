import { http } from './http'
import type { Statement } from '@/types'

const BASE_URL = '/api/v1'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchBlob(url: string): Promise<string> {
  const res = await fetch(url, { headers: authHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

function mapStatement(s: Record<string, unknown>): Statement {
  return {
    id: s.id as string,
    bank_type: s.bankType as Statement['bank_type'],
    statement_month: ((s.statementMonth as string) ?? '').split('T')[0],
    pdf_path: s.pdfPath as string,
    uploaded_at: s.uploadedAt as string,
  }
}

export const statementService = {
  getAll: async (): Promise<Statement[]> => {
    const res = await http.get<Record<string, unknown>[]>('/statements?limit=100')
    return res.data.map(mapStatement)
  },

  upload: async (file: File, bankType: string, statementMonth: string): Promise<Statement> => {
    const form = new FormData()
    form.append('file', file)
    form.append('bankType', bankType)
    form.append('statementMonth', statementMonth)
    const res = await http.postFormData<Record<string, unknown>>('/statements', form)
    return mapStatement(res.data)
  },

  /** Fetches PDF with auth header, returns a temporary blob URL for download. */
  downloadFile: async (id: string): Promise<string> => {
    return fetchBlob(`${BASE_URL}/statements/${id}/download`)
  },

  /** Fetches PDF with auth header, returns a temporary blob URL for inline preview. */
  previewFile: async (id: string): Promise<string> => {
    return fetchBlob(`${BASE_URL}/statements/${id}/preview`)
  },
}

