interface ApiConfig {
  baseURL: string
  token: string | null
}

interface ApiError {
  error: string
  message?: string
}

export const useApi = () => {
  const runtimeConfig = useRuntimeConfig();
  const config = useState<ApiConfig>('api-config', () => ({
    baseURL: runtimeConfig.public.apiBaseUrl || 'http://localhost:4000',
    token: null
  }))

  // Load token from localStorage on client
  if (process.client) {
    const stored = localStorage.getItem('auth_token')
    if (stored) {
      config.value.token = stored
    }
  }

  const setToken = (token: string | null) => {
    config.value.token = token
    if (process.client) {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  const getToken = () => config.value.token

  const clearToken = () => {
    setToken(null)
  }

  // API request wrapper
  const apiRequest = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (config.value.token) {
      headers['Authorization'] = `Bearer ${config.value.token}`
    }

    const url = `${config.value.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`
        }))
        throw new Error(error.error || error.message || 'Request failed')
      }

      return await response.json()
    } catch (err: any) {
      console.error('API request failed:', err)
      throw err
    }
  }

  // Convenience methods
  const get = <T = any>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'GET' })

  const post = <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })

  const put = <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    })

  const del = <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' })

  // Upload with FormData (multipart/form-data)
  const upload = async <T = any>(
    endpoint: string,
    formData: FormData
  ): Promise<T> => {
    const headers: Record<string, string> = {}

    if (config.value.token) {
      headers['Authorization'] = `Bearer ${config.value.token}`
    }

    const url = `${config.value.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      })

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`
        }))
        throw new Error(error.error || error.message || 'Upload failed')
      }

      return await response.json()
    } catch (err: any) {
      console.error('Upload failed:', err)
      throw err
    }
  }

  return {
    setToken,
    getToken,
    clearToken,
    apiRequest,
    get,
    post,
    put,
    del,
    upload
  }
}
