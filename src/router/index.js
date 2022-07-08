import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index'
import pipeline from '@/middlewares/pipeline'
import routes from '@/router/routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  await store.restored

  await store.dispatch('init')

  // region Если нету то далее
  if (!to.meta.middleware) {
    return next()
  }
  // endregion

  // region Запускаем конвеер защитников
  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
    store,
    router
  }
  return middleware[0]({
    ...context,
    nextMiddleware: pipeline(context, middleware, 1)
  })
  // endregion
})

export default router
