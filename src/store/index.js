import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import modules from '@/store/modules'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  supportCircular: true,
  strict: true // This makes the Vuex store strict
})

export default createStore({
  strict: true,
  modules,
  actions: {
    reset ({ commit }) {
      for (const moduleName of Object.keys(modules)) {
        if (modules[moduleName].mutations.RESET) {
          commit(`${moduleName}/RESET`)
        }
      }
    },
    async init ({ commit, dispatch }) {
      if (localStorage.getItem('store.state')) {
        commit('INIT', JSON.parse(localStorage.getItem('store.state')))
      }
      for (const moduleName of Object.keys(modules)) {
        if (modules[moduleName].actions.init) {
          await dispatch(`${moduleName}/init`)
        }
      }
    },
    async save ({ dispatch, state }) {
      if (state) {
        localStorage.setItem('store.state', JSON.stringify(state))
      }
      for (const moduleName of Object.keys(modules)) {
        if (modules[moduleName].actions.save) {
          await dispatch(`${moduleName}/save`)
        }
      }
    }
  },
  mutations: {
    INIT (state, newState) {
    },
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION // this mutation **MUST** be named "RESTORE_MUTATION"
  },
  plugins: [vuexLocal.plugin]
})
