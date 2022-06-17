import Home from '@/views/Home'
import About from '@/views/About'
import Calendar from '@/views/Calendar'

export default [
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      // middleware: [guest]
    }
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      // middleware: [auth]
    }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: Calendar,
    meta: {
      // middleware: [auth]
    }
  }
]
