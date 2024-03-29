import { computed } from 'vue'
import { useStore } from 'vuex'
import camelCase from 'lodash/camelCase'
const mapState = (namespace) => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store.state[namespace]).map(
      key => [key, computed(() => store.state[namespace][key])]
    )
  )
}
const mapGetters = (namespace) => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store.getters[namespace]).map(
      getter => [getter, computed(() => store.getters[namespace][getter])]
    )
  )
}
const mapMutations = (namespace) => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store._mutations).map(
      mutation => [camelCase(mutation.replace(`${namespace}/`, '')), value => store.commit(mutation, value)]
    )
  )
}
const mapActions = (namespace) => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store._actions).map(
      action => [action.replace(`${namespace}/`, ''), value => store.dispatch(action, value)]
    )
  )
}
export { mapState, mapGetters, mapMutations, mapActions }
