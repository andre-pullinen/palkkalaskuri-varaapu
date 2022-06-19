<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import Datepicker from '@vuepic/vue-datepicker'

import PercentNumber from '@/components/PercentNumber'
import { mapState } from '@/map'
const { salaryT, startedAt } = mapState('user')
const salaryInfo = salaryT.value
const setupForm = ref()
const store = useStore()
const isSetup = computed(() => store.state.user.isSetup)
const evak = computed({
  get: () => salaryInfo.evak,
  set: val => {
    console.log('SET EVAK', val)
    store.commit('user/SET_EVAK', val)
  }
})
const tvak = computed({
  get: () => salaryInfo.tvak,
  set: val => {
    store.commit('user/SET_TVAK', val)
  }
})
const tax = computed({
  get: () => salaryInfo.tax,
  set: val => {
    store.commit('user/SET_TAX', val)
  }
})
const isHolidayPay = computed({
  get: () => salaryInfo.isHolidayPay,
  set: val => {
    store.commit('user/SET_ISHOLIDAYPAY', val)
  }
})
const holidayPay = computed({
  get: () => salaryInfo.holidayPay,
  set: val => {
    store.commit('user/SET_HOLIDAYPAY', val)
  }
})
const startedAtDate = computed({
  get: () => startedAt.value,
  set: val => {
    store.commit('user/SET_STARTEDAT', val)
  }
})
const salary = computed({
  get: () => salaryInfo.amount,
  set: val => {
    store.commit('user/SET_SALARY', val)
  }
})
const format = (date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}
console.log(store.state.user.evak)
</script>

<template>
  <div class="home">
    it's {{ isSetup }}
    <form ref="setupForm">
      <Datepicker v-model="startedAtDate" :disabled-week-days="[6, 0, 2, 3, 4, 5]" :enable-time-picker="false" :format="format"></Datepicker>
      <div>
        EVAK:
        <percent-number type="number" v-model="evak" :max="100" :min="0" has-control-inputs />
      </div>
      <div>
        TVAK:
        <percent-number type="number" v-model="tvak" :max="100" :min="0" has-control-inputs />
      </div>
      <div>
        tax:
        <percent-number type="number" v-model="tax" :max="100" :min="0" has-control-inputs />
      </div>
      <div>
        isHolidayPay:
        <input type="radio" value="true" v-model="isHolidayPay" />
        <input type="radio" value="false" v-model="isHolidayPay" />
      </div>
      <div>
        holidayPay:
        <percent-number type="number" v-model="holidayPay" :max="100" :min="0" has-control-inputs />
      </div>
      <div>
        salary:
        <input type="number" v-model="salary" />
      </div>
    </form>
    <router-link to="calendar">Перейти к календарю</router-link>
  </div>
</template>
