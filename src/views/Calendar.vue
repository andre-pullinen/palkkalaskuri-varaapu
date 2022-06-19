<template>
  <div class="calendar">
    <input v-model="year" type="number">
    <input v-model="month" type="number">
    <Periods v-for="(period, key, i) in periods" :weeks="period" :key="key" :class="i % 2 === 0 ? 'pink' : 'blue'" />
    <Modal
      v-model="isShow"
      :close="closeModal"
    >
      <div class="modal">
        <div>
          <h3>{{ workDay.format('YYYY MMM D') }}</h3>
          <vue3-simple-typeahead
            id="typeahead_id"
            placeholder="Start writing..."
            :items="store.getters['user/getJobPlaces']()"
            :minInputLength="1"
            @onInput="onInputEventHandler"
            @selectItem="selectItemEventHandler"
          />
          <Datepicker v-model="workStarted" time-picker />
          <Datepicker v-model="workFinished" time-picker />
          {{ workFullTime }}
        </div>
        <button @click="saveJob">
          save
        </button>
        <button @click="closeModal">
          close
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, inject, reactive, ref } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import { useStore } from 'vuex'
import Periods from '@/components/Calendar/Periods'

const dayjs = inject('dayJS')
const event = inject('event')

event.on('day.addShift', showModal)

const store = useStore()

const isShow = ref(false)
const workName = ref('')
const workStarted = ref({
  hours: dayjs().hour(),
  minutes: 0
})
const workFinished = ref({
  hours: dayjs().add(6, 'h').hour(),
  minutes: 0
})
const workDay = ref(dayjs())
const workFullTime = computed(() => {
  const startDay = dayjs(workDay.value).hour(workStarted.value.hours).minute(workStarted.value.minutes)
  let finishDay = dayjs(workDay.value).hour(workFinished.value.hours).minute(workFinished.value.minutes)
  if (workStarted.value.hours > workFinished.value.hours) {
    finishDay = finishDay.add(1, 'd')
  }
  return { startDay, finishDay }
}, 'h')
// eslint-disable-next-line no-unused-vars
function showModal (date) {
  workDay.value = dayjs(date)
  console.log(date)
  isShow.value = true
}
function selectItemEventHandler (e) {
  workName.value = e
}
function onInputEventHandler (e) {
  console.log(e)
  workName.value = e.input
}
function saveJob () {
  const payload = {
    name: workName.value,
    date: workDay.value,
    startedAt: workFullTime.value.startDay,
    finishedAt: workFullTime.value.finishDay
  }
  store.dispatch('user/addJob', payload)
  updateCalendar()
}

function closeModal () {
  isShow.value = false
}

function getNumberOfDaysInMonth (year, month) {
  return dayjs(`${year}-${month}-01`).daysInMonth()
}

function getWeekday (date) {
  return dayjs(date).weekday()
}

function createDaysForCurrentMonth (year, month) {
  return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
    const date = dayjs(`${year}-${month}-${index + 1}`).format('YYYY-MM-DD')
    return {
      date,
      job: store.getters['user/getJobByDate'](date),
      dayOfMonth: index + 1,
      isCurrentMonth: true
    }
  })
}

function createDaysForPreviousMonth (year, month, currentMonthDays) {
  const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date)

  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month')

  // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
  const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday

  const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
    .subtract(visibleNumberOfDaysFromPreviousMonth, 'day')
    .date()

  return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
    const date = dayjs(
      `${previousMonth.year()}-${previousMonth.month() + 1}-${
        previousMonthLastMondayDayOfMonth + index
      }`
    ).format('YYYY-MM-DD')
    return {
      date,
      job: store.getters['user/getJobByDate'](date),
      dayOfMonth: previousMonthLastMondayDayOfMonth + index,
      isCurrentMonth: false
    }
  })
}

function createDaysForNextMonth (year, month, currentMonthDays) {
  const lastDayOfTheMonthWeekday = getWeekday(
    `${year}-${month}-${currentMonthDays.length}`
  )
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month')

  return [...Array(6 - lastDayOfTheMonthWeekday)].map((day, index) => {
    const date = dayjs(
      `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
    ).format('YYYY-MM-DD')
    return {
      date,
      job: store.getters['user/getJobByDate'](date),
      dayOfMonth: index + 1,
      isCurrentMonth: false
    }
  })
}
// eslint-disable-next-line no-unused-vars
const periods = reactive({})
const weeks = ref([])
let week = { days: [], weekNumber: 0 }

const currentYear = ref(2022)
const currentMonth = ref(8)
const year = computed({
  get: () => currentYear.value,
  set: val => {
    currentYear.value = Number(val)
    updateCalendar()
  }
})
const month = computed({
  get: () => currentMonth.value,
  set: val => {
    currentMonth.value = Number(val)
    updateCalendar()
  }
})

function updateCalendar () {
  week = { days: [], weekNumber: 0 }
  console.log('updateCalendar')

  const current = createDaysForCurrentMonth(
    year.value,
    month.value
  )
  const daysInMouth = [...createDaysForPreviousMonth(year.value, month.value, current),
    ...current,
    ...createDaysForNextMonth(year.value, month.value, current)]
  console.log(createDaysForNextMonth(year.value, month.value, current))

  const periodStarted = dayjs(store.state.user.startedAt).hour(0).minute(0).second(0)
  weeks.value.splice(0, weeks.value.length)
  for (const key in periods) {
    delete periods[key]
  }
  daysInMouth.map((day, index) => {
    week.days.push(day)
    if ((index + 1) % 7 === 0) {
      const dayOfWeek = dayjs(day.date)
      const diffInW = Math.floor(dayOfWeek.diff(periodStarted, 'week', true)) + 6
      const newPeriodStarted = dayOfWeek.weekday(diffInW % 2 === 0 ? 0 : -7)
      const key = `${newPeriodStarted.format('YYYY-MM-DD')}/${newPeriodStarted.weekday(13).format('YYYY-MM-DD')}`
      week.weekNumber = dayOfWeek.week()
      week.diffOfPeriod = Math.ceil(dayOfWeek.diff(dayjs(store.state.user.startedAt), 'week', true))
      weeks.value.push(week)

      if (!periods[key]) {
        periods[key] = []
      }
      periods[key].push(week)

      week = { days: [], weekNumber: 0 }
    }
  })
}

updateCalendar()
</script>

<style scoped lang="scss">
.week {
  position: relative;
  &__number {
    position: absolute;
    font-size: 48px;
    font-weight: 300;
    color: #5f5f5f;
    top: 50%;
    transform: translateY(-50%)
  }
  &__days {
    width: 80%;
    margin: 0 auto;
  }
}
.blue {
  background-color: #D3FCFF;
}
.pink {
  background-color: #FFEFFF;
}
.modal {
  width: 300px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
}
</style>
