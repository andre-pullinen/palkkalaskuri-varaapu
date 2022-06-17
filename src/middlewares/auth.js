export default function auth ({ store, router, nextMiddleware }) {
  if (!store.state.user.isAuth) {
    router.push({ name: 'login' })
  }
  return nextMiddleware()
}
