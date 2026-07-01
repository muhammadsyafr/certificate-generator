export const useAuth = () => {
  const { clearToken, get } = useApi()
  const user = useState<any>('auth-user', () => null)

  const loadUser = async () => {
    try {
      const data = await get('/api/auth/me')
      user.value = data
    } catch (err) {
      console.error('Failed to load user:', err)
      user.value = null
    }
  }

  const logout = () => {
    clearToken()
    user.value = null
    navigateTo('/signin')
  }

  const getUserInitials = () => {
    if (!user.value?.name) return '?'
    const parts = user.value.name.split(' ')
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const isAdmin = computed(() => user.value?.isAdmin === true)

  return {
    user,
    loadUser,
    logout,
    getUserInitials,
    isAdmin
  }
}
