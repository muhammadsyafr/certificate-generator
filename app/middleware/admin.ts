export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loadUser } = useAuth()

  if (!user.value) {
    await loadUser()
  }

  if (!user.value?.isAdmin) {
    return navigateTo('/')
  }
})
