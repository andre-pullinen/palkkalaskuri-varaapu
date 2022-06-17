export default function guest ({ store, router, nextMiddleware }) {
  if (store.state.user.isAuth) {
    router.push({ name: 'home' })
  }
  return nextMiddleware()
}
