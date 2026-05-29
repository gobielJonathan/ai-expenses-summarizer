import { defineStore } from 'pinia'
import { ref } from 'vue'
import { whatsappService, type WhatsappStatus } from '@/services/whatsapp.service'

export const useWhatsappStore = defineStore('whatsapp', () => {
  const status = ref<WhatsappStatus | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStatus() {
    loading.value = true
    error.value = null
    try {
      const res = await whatsappService.getStatus()
      status.value = res.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load WhatsApp status'
    } finally {
      loading.value = false
    }
  }

  async function link(phoneNumber: string): Promise<string> {
    const res = await whatsappService.link(phoneNumber)
    return res.data.message
  }

  async function verify(phoneNumber: string, otp: string): Promise<string> {
    const res = await whatsappService.verify(phoneNumber, otp)
    await fetchStatus()
    return res.data.message
  }

  async function unlink(): Promise<string> {
    const res = await whatsappService.unlink()
    status.value = { linked: false, account: null }
    return res.data.message
  }

  return { status, loading, error, fetchStatus, link, verify, unlink }
})
