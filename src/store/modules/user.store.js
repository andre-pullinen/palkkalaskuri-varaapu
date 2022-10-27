/* user.store.js */

import dayjs from 'dayjs'
// eslint-disable-next-line no-unused-vars
import Holidays from 'date-holidays'
import { ref, push, set, remove } from 'firebase/database'
import { database } from '@/firebase'
import { v4 as uuidv4 } from 'uuid'

const initialState = () => ({
  isAuth: false,
  auth: {
    uid: '',
    name: '',
    email: '',
    photo: '',
    token: ''
  },
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
      if (start.minute() !== 0) {
        diff = -(start.minute() / 60)
      }
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
  auth ({ commit }, payload) {
    commit('USER_AUTH', payload.status)
    commit('USER_FETCH', payload.user)
  },
  async addJob ({ commit, state }, payload) {
    let usualHours = 0
    let tonightHours = 0
    let nightHours = 0
    let saturdayHours = 0
    let sundayHours = 0

    let start = payload.startedAt
    const end = payload.finishedAt
    const hd = new Holidays('fi')

    while (start.diff(end) < 0) {
      const holidayInfo = hd.isHoliday(start)
      let isPublicHoliday = false
      let isBankHoliday = false
      if (holidayInfo) {
        isPublicHoliday = hd.isHoliday(start).some(e => e.type === 'public')
        isBankHoliday = hd.isHoliday(start).some(e => e.type === 'bank')
      }
      const weekday = start.weekday()
      const hour = start.hour()
      let diff = start.diff(end, 'h', true)
      if (start.minute() !== 0) {
        diff = -(Math.round((1 - (start.minute() / 60)) * 100) / 100)
      }
      let exponent = 1
      if (diff < 0 && diff > -1) {
        exponent = Math.abs(diff)
      }

      usualHours += exponent

      if (weekday === 6 || isPublicHoliday) {
        sundayHours += exponent
      }
      if ((weekday === 5 && hour >= 13) || (isBankHoliday && hour >= 18)) {
        saturdayHours += exponent
      } else if (hour >= 18) {
        tonightHours += exponent
      }

      if (hour < 6 && !isPublicHoliday) {
        nightHours += exponent
      }

      if (start.minute() !== 0) {
        start = start.add(60 - start.minute(), 'm')
      } else {
        start = start.add(1, 'h')
      }
    }

    payload.workTime = { usualHours, tonightHours, nightHours, saturdayHours, sundayHours }
    payload.startedTimeAt = payload.startedAt.format('HH.mm')
    payload.finishedTimeAt = payload.finishedAt.format('HH.mm')
    const n = new Date(0, 0)
    let SAt = payload.startedAt.clone()
    if (payload.isLunch) {
      SAt = SAt.add(payload.lunchTime, 'minute')
    }
    n.setSeconds(+Math.abs(SAt.diff(payload.finishedAt, 'hour', true)) * 60 * 60)
    payload.workHours = n.toTimeString().slice(0, 5)
    payload.startedAt = payload.startedAt.toString()
    payload.finishedAt = payload.finishedAt.toString()
    payload.uid = uuidv4()
    payload.date = payload.date.format('YYYY-MM-DD')
    if (state.isAuth) {
      const pushedItem = push(ref(database, `users/${state.auth.uid}/shifts`))
      await set(pushedItem, payload)
      payload.uid = pushedItem.key
    }
    await commit('ADD_JOB', payload)
    const trimmedName = payload.name.trim()
    if (trimmedName !== '') {
      commit('INCREASE_PLACE', trimmedName)
    }
  },
  async removeJob ({ commit, state }, payload) {
    if (state.isAuth) {
      remove(ref(database, `users/${state.auth.uid}/shifts/${payload.uid}`))
    }
    await commit('REMOVE_JOB', payload)
  },
  async clearJob ({ commit }, payload) {
    await commit('CLEAR_JOB', payload)
  }
}
// Mutations
const mutations = {
  SETUP (state) {
    state.isSetup = false
  },
  USER_AUTH (state, status) {
    state.isAuth = status
  },
  USER_FETCH (state, user) {
    state.auth = user
  },
  INCREASE_PLACE (state, name) {
    state.places[name]++
  },
  CLEAR_JOB (state, payload) {
    delete state.jobHistory[payload.date]
  },
  ADD_JOB (state, payload) {
    const { uid, date } = payload
    if (!state.jobHistory[date]) {
      state.jobHistory[date] = {}
    }
    state.jobHistory[payload.date][uid] = payload
  },
  REMOVE_JOB (state, payload) {
    if (state.jobHistory[payload.date]) {
      console.log(state.jobHistory[payload.date][payload.uid])
      console.log(state.jobHistory[payload.date])
      console.log(payload)
      delete state.jobHistory[payload.date][payload.uid]
    }
  },
  SET_EVAK (state, val) {
    state.salaryT.evak = val
  },
  SET_TVAK (state, val) {
    state.salaryT.tvak = val
  },
  SET_TAX (state, val) {
    state.salaryT.tax = val
  },
  SET_SALARY (state, val) {
    state.salaryT.amount = val
  },
  SET_ISHOLIDAYPAY (state, val) {
    state.salaryT.isHolidayPay = val
  },
  SET_HOLIDAYPAY (state, val) {
    state.salaryT.holidayPay = val
  },
  SET_STARTEDAT (state, val) {
    state.startedAt = val
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
