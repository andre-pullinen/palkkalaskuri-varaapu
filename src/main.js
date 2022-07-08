import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import event from './event'
import dayjs from 'dayjs'
import holidays from 'date-holidays'
import VueUniversalModal from 'vue-universal-modal'
import SimpleTypeahead from 'vue3-simple-typeahead'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import VueGtag from 'vue-gtag'
import i18n from '@/i18n'

import 'normalize.css'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css' // Optional default CSS
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-universal-modal/dist/index.css'

import fiLocale from 'dayjs/locale/fi'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import duration from 'dayjs/plugin/duration'

dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(duration)
dayjs.locale(fiLocale)

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(PerfectScrollbar)
  .use(SimpleTypeahead)
  .use(VueUniversalModal, {
    teleportTarget: '#modals'
  })
  .use(VueGtag, {
    appName: 'palkka-laskuri',
    pageTrackerScreenviewEnabled: true,
    config: {
      id: 'G-RYBVPVKXMW'
    }
  }, router) // <----- add your router here
  .provide('dayJS', dayjs)
  .provide('event', event)
  .provide('holidays', holidays)
  .mount('#app')
