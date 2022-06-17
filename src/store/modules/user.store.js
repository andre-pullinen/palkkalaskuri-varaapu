/* user.store.js */

import dayjs from 'dayjs'

const initialState = () => ({
  interval: 14,
  startedAt: '',
  isSetup: false,
  tvak: 0.0715,
  evak: 0.014,
  tax: 0.005,
  isHolidayPay: true,
  holidayPay: 0.1,
  saturdayPay: 0,
  isSaturdayTonightPay: true,
  saturdayTonightPay: 5.46,
  isTonightPay: true,
  tonightPay: 4.18,
  isNightPay: true,
  nightPay: 6.28,
  sundayPay: 1,
  salary: 10.28,
  salaryT: {
    tvak: 0.0715,
    evak: 0.014,
    tax: 0.005,
    isHolidayPay: true,
    holidayPay: 0.1,
    saturdayPay: 0,
    isSaturdayTonightPay: true,
    saturdayTonightPay: 5.46,
    isTonightPay: true,
    tonightPay: 4.18,
    isNightPay: true,
    nightPay: 6.28,
    sundayPay: 1,
    amount: 10.28
  },
  places: {},
  jobHistory: {}
})

// State object
const state = initialState()

// Getter functions
const getters = {
  getJobHistory: (state) => () => {
    return state.jobHistory
  },
  getJobByDate: (state) => (date) => {
    const key = Object.keys(state.jobHistory).find(key => key === date)

    return key ? state.jobHistory[key] : null
  },
  getJobPlaces: (state) => () => {
    if (state.places.length <= 0) {
      return []
    }

    return Object.keys(state.places)
  },
  getSalaryForJob: (state) => (job, isWithTaxes = true) => {
    let start = dayjs(job.startedAt)
    const end = dayjs(job.finishedAt)
    let salary = 0
    while (start.diff(end) < 0) {
      let diff = start.diff(end, 'h', true)
      console.log('diff', diff)
      if (start.minute() !== 0) {
        diff = -(start.minute() / 60)
      }
      console.log('diff_t', diff)
      const weekday = start.weekday()
      const hour = start.hour()
      if (diff < 0 && diff > -1) {
        salary += state.salary * Math.abs(diff)
      } else {
        salary += state.salary
      }

      if (weekday === 0) {
        salary += state.salary * state.sundayPay
      }

      if (weekday === 6 && state.saturdayTonightPay && hour >= 13) {
        salary += state.saturdayTonightPay
      } else if (state.isTonightPay && hour >= 18) {
        salary += state.tonightPay
      }

      if (state.isNightPay && hour < 6) {
        salary += state.nightPay
      }
      if (start.minute() !== 0) {
        start = start.add(60 - start.minute(), 'm')
      } else {
        start = start.add(1, 'h')
      }
    }

    if (isWithTaxes) {
      if (state.isHolidayPay) {
        salary += salary * state.holidayPay
      }
      return Math.round((salary - (salary * state.tvak) - (salary * state.evak) - (salary * state.tax)) * 100) / 100
    }
    return Math.round(salary * 100) / 100
  }
}

// Actions
const actions = {
  reset ({ commit }) {
    commit('RESET')
  },
  setup ({ commit }) {
    commit('SETUP')
  },
  addJob ({ commit }, payload) {
    commit('ADD_JOB', payload)
    commit('INCREASE_PLACE', payload.name)
  },
  removeJob ({ commit }, payload) {
    commit('REMOVE_JOB', payload)
  }
}
// Mutations
const mutations = {
  SETUP (state) {
    state.isSetup = false
  },
  INCREASE_PLACE (state, name) {
    state.places[name]++
  },
  ADD_JOB (state, payload) {
    if (!state.jobHistory[payload.date.format('YYYY-MM-DD')]) {
      state.jobHistory[payload.date.format('YYYY-MM-DD')] = {}
    }
    const uuid = uuidv4()
    state.jobHistory[payload.date.format('YYYY-MM-DD')][uuid] = payload
  },
  REMOVE_JOB (state, payload) {
    if (state.jobHistory[payload.date]) {
      delete state.jobHistory[payload.date][payload.uuid]
    }
  },
  SET_EVAK (state, val) {
    state.evak = val
  },
  SET_TVAK (state, val) {
    state.tvak = val
  },
  SET_TAX (state, val) {
    state.tax = val
  },
  SET_SALARY (state, val) {
    state.salary = val
  },
  SET_ISHOLIDAYPAY (state, val) {
    state.isHolidayPay = val
  },
  SET_HOLIDAYPAY (state, val) {
    state.holidayPay = val
  },
  SET_STARTEDAT (state, val) {
    state.startedAt = val
  }
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
