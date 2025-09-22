import { ApiResponse, Script, Voice, VoiceCloneRequest, User } from '@/types'

const API_BASE_URL = process.env.VITE_BASE_API_URL
const API_KEY = process.env.VITE_API_KEY

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      }

      // Add API key header if available
      if (API_KEY) {
        headers['X-API-Key'] = API_KEY
      }

      const response = await fetch(url, {
        headers,
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: 'Network error occurred',
      }
    }
  }

  // Authentication
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  // Script Generation
  async generateScriptFromYoutube(url: string): Promise<ApiResponse<Script>> {
    return this.request('/scripts/from-youtube', {
      method: 'POST',
      body: JSON.stringify({ url }),
    })
  }

  async generateScriptFromIdea(idea: string): Promise<ApiResponse<Script>> {
    return this.request('/scripts/from-idea', {
      method: 'POST',
      body: JSON.stringify({ idea }),
    })
  }

  // Text-to-Speech
  async convertTextToSpeech(
    text: string,
    voiceId: string
  ): Promise<ApiResponse<{ audioUrl: string }>> {
    return this.request('/tts/convert', {
      method: 'POST',
      body: JSON.stringify({ text, voiceId }),
    })
  }

  async convertMultipleTexts(
    requests: Array<{ text: string; voiceId: string }>
  ): Promise<ApiResponse<Array<{ audioUrl: string; index: number }>>> {
    return this.request('/tts/convert-multiple', {
      method: 'POST',
      body: JSON.stringify({ requests }),
    })
  }

  // Voice Management
  async getVoices(): Promise<ApiResponse<Voice[]>> {
    return this.request('/voices')
  }

  async cloneVoice(request: VoiceCloneRequest): Promise<ApiResponse<Voice>> {
    const formData = new FormData()
    formData.append('name', request.name)
    formData.append('audio', request.audioFile)
    if (request.description) {
      formData.append('description', request.description)
    }

    const headers: Record<string, string> = {}

    // Add API key header if available
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY
    }

    return this.request('/voices/clone', {
      method: 'POST',
      body: formData,
      headers, // Remove Content-Type to let browser set it with boundary
    })
  }

  async deleteVoice(voiceId: string): Promise<ApiResponse<void>> {
    return this.request(`/voices/${voiceId}`, {
      method: 'DELETE',
    })
  }

  // File Upload
  async uploadTextFiles(
    files: File[]
  ): Promise<ApiResponse<Array<{ content: string; fileName: string }>>> {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file)
    })

    const headers: Record<string, string> = {}

    // Add API key header if available
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY
    }

    return this.request('/files/upload-text', {
      method: 'POST',
      body: formData,
      headers, // Remove Content-Type to let browser set it with boundary
    })
  }

  // User Profile
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile')
  }

  async updateUserProfile(data: {
    name?: string
    email?: string
  }): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()

// Utility functions for handling API responses
export function handleApiError(
  response: ApiResponse,
  defaultMessage = 'An error occurred'
) {
  if (!response.success) {
    throw new Error(response.error || defaultMessage)
  }
  return response.data
}

export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: true; data: T } {
  return response.success
}
