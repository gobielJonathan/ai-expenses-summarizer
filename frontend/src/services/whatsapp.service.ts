import { http } from './http'

export interface WhatsappStatus {
  linked: boolean
  account: {
    phoneNumber: string
    isVerified: boolean
    createdAt: string
  } | null
}

export const whatsappService = {
  getStatus() {
    return http.get<WhatsappStatus>('/whatsapp/status')
  },
  link(phoneNumber: string) {
    return http.post<{ message: string; phoneNumber: string }>('/whatsapp/link', { phoneNumber })
  },
  verify(phoneNumber: string, otp: string) {
    return http.post<{ message: string; phoneNumber: string }>('/whatsapp/verify', { phoneNumber, otp })
  },
  unlink() {
    return http.delete<{ message: string }>('/whatsapp/unlink')
  },
}
