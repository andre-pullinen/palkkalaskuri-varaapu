/* user.store.js */

const initialState = () => ({
  timezone: 3
})

// State object
const state = initialState()

// Getter functions
const getters = {
}

// Actions
const actions = {
  reset ({ commit }) {
    commit('RESET')
  }
}
// Mutations
const mutations = {
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
