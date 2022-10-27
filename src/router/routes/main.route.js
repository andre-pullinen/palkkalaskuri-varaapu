import Home from '@/views/Home'
import LangParent from '@/views/LangParent'
import i18n from '@/i18n'
const Calendar = () => import('@/views/Calendar')
const CalendarV2 = () => import('@/views/CalendarV2')
const Settings = () => import('@/views/Settings')
const supportedLangs = ['fi', 'en']

export default [{
  path: '/:lang(en|fi)?',
  component: LangParent,
  beforeEnter (to, from, next) {
    const lang = to.params.lang
    if (supportedLangs.includes(lang)) {
      if (i18n.locale !== lang) {
        i18n.locale = lang
      }
      return next()
    }
    return next(i18n.locale)
  },
  children: [
    {
      path: '',
      name: 'home',
      component: Home,
      meta: {
        name: 'Koti'
        // middleware: [auth]
      }
    },
    {
      path: 'calendar',
      name: 'calendar',
      component: Calendar,
      meta: {
        name: 'Kalenteri'
        // middleware: [auth]
      }
    },
    {
      path: 'calendar2',
      name: 'calendar2',
      component: CalendarV2,
      meta: {
        name: 'Kalenteri testi'
        // middleware: [auth]
      }
    },
    {
      path: 'settings',
      name: 'settings',
      component: Settings,
      meta: {
        name: 'Asetukset'
        // middleware: [auth]
      }
    }
  ]
}]
