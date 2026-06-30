export default defineNuxtRouteMiddleware((to, from) => {
  // Public routes that don't require auth
  const publicRoutes = ['/', '/signin', '/signup', '/guide']
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => to.path === route)
  
  if (isPublicRoute) {
    return
  }
  
  // Check auth only on client side
  if (process.client) {
    const { getToken } = useApi()
    const token = getToken()
    
    if (!token) {
      // Redirect to signin if not authenticated
      return navigateTo('/signin')
    }
  }
})
