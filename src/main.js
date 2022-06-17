import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
import VueUniversalModal from 'vue-universal-modal'
import SimpleTypeahead from 'vue3-simple-typeahead'

import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css' // Optional default CSS
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-universal-modal/dist/index.css'

import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import duration from 'dayjs/plugin/duration'

dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(duration)

createApp(App)
  .use(store)
  .use(router)
  .use(SimpleTypeahead)
  .use(VueUniversalModal, {
    teleportTarget: '#modals'
  })
  .provide('dayJS', dayjs)
  .mount('#app')
