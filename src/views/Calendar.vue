<template>
  <div class="calendar">
    <input v-model="year" type="number">
    <input v-model="month" type="number">
    <div v-for="(week, key) in weeks" :key="key" :class="'week ' + (Math.floor((week.diffOfPeriod + 5) / 2) % 2 ? 'blue' : 'pink')">
      <div class="week__number">#{{ week.weekNumber }}</div>
      <div class="week__days">
        <div v-for="(day, key) in week.days" :key="key" class="day">
          <span class="day__marker">{{ day.dayOfMonth }}</span>
          <div v-for="(job, key) in day.job" class="job" :key="key">
            <span class="job__delete" @click="() => { deleteJob(job, key) }"><vue-feather type="x" size="0.8em"></vue-feather></span>
            <span class="job__edit"><vue-feather type="edit" size="0.8em"></vue-feather></span>
            <p class="job__title">{{ job.name }}</p>
            <p class="job__time">{{ dayjs(job.startedAt).format('HH.mm') }} -
              {{ dayjs(job.finishedAt).format('HH.mm') }}
              ({{ humanizeTime(Math.abs(dayjs(job.startedAt).diff(dayjs(job.finishedAt), 'hour', true))) }})</p>
            <p class="job__salary">
              {{ store.getters['user/getSalaryForJob'](job, false) }} €
            </p>
          </div>
          <span class="day__add-job" @click.prevent="() => { showModal(day.date) }"><vue-feather type="plus" size="1em"></vue-feather></span>
        </div>
      </div>
      <div class="week__salary">
        {{ getSalaryForWeek(week) }} €
      </div>
    </div>
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
import { computed, inject, ref } from 'vue'
import VueFeather from 'vue-feather'
import Datepicker from '@vuepic/vue-datepicker'
import { useStore } from 'vuex'

const dayjs = inject('dayJS')

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
function showModal (date) {
  workDay.value = dayjs(date)
  console.log(date)
  isShow.value = true
}
function humanizeTime (hours) {
  const n = new Date(0, 0)
  n.setSeconds(+hours * 60 * 60)
  return n.toTimeString().slice(0, 5)
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
  console.log(payload)
  store.dispatch('user/addJob', payload)
  updateCalendar()
}

function getSalaryForWeek (week) {
  let salary = 0
  week.days.forEach((day) => {
    if (day.job !== null) {
      for (const [key, job] of Object.entries(day.job)) {
        console.log(key)
        salary += store.getters['user/getSalaryForJob'](job, false)
      }
    }
  })

  return Math.round(salary * 100) / 100
}

function closeModal () {
  isShow.value = false
}
function deleteJob (job, key) {
  const payload = {
    date: dayjs(job.date).format('YYYY-MM-DD'),
    uuid: key
  }
  store.dispatch('user/removeJob', payload)
  // updateCalendar()
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
    ? firstDayOfTheMonthWeekday - 1
    : 6

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

  const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
    ? 7 - lastDayOfTheMonthWeekday
    : lastDayOfTheMonthWeekday

  return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
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
const weeks = ref([])
let week = { days: [], weekNumber: 0 }

const currentYear = ref(2022)
const currentMonth = ref(6)
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
  console.log('updateCalendar')

  const current = createDaysForCurrentMonth(
    year.value,
    month.value
  )
  const daysInMouth = [...createDaysForPreviousMonth(year.value, month.value, current),
    ...current,
    ...createDaysForNextMonth(year.value, month.value, current)]

  weeks.value.splice(0, weeks.value.length)
  daysInMouth.map((day, index) => {
    week.days.push(day)
    if ((index + 1) % 7 === 0) {
      console.log(day)
      week.weekNumber = dayjs(day.date).week()
      week.diffOfPeriod = Math.ceil(dayjs(day.date).diff(dayjs(store.state.user.startedAt), 'week', true))
      weeks.value.push(week)
      week = { days: [], weekNumber: 0 }
    }
  })
}

updateCalendar()

console.log(weeks.value)
console.table(store.getters['user/getJobHistory']())
console.table(store.getters['user/getJobPlaces']())
const job = store.getters['user/getJobByDate']('2022-06-25')
if (job) {
  console.log(store.getters['user/getSalaryForJob'](job))
}

</script>

<style scoped lang="scss">
.day {
  display: inline-block;
  position: relative;
  width: calc(80% / 7);
  height: 100px;
  padding-top: 2em;
  background: rgba(213, 213, 213, 0.3);
  vertical-align: top;
  &__marker {
    position: absolute;
    top: 5px;
    left: 5px;
    font-size: 1.2em;
  }
  &__add-job {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #007BFF;
    color: white;
    width: 1.265em;
    height: 1.265em;
    line-height: 1.55em;
    border-radius: 5px;
  }
}
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
.job {
  position: relative;
  background-color: #28A745;
  color: #fdfdfd;
  border-radius: 5px;
  padding: 1.2em 0.3em;
  max-width: 70%;
  margin: 0 auto;
  font-size: 0.8em;
  &__delete, &__edit {
    font-size: 1.2em;
    position: absolute;
    top: 3px;
  }
  &__delete {
    color: red;
    right: 5px;
    cursor: pointer;
  }
  &__edit {
    color: blue;
    left: 5px;
    cursor: pointer;
  }
  &__title, &__time, &__salary {
    margin: 0;
  }
  &__title {
    font-weight: 600;
  }
  &__time {
    font-weight: 300;
  }
  &__salary {
    padding: 0.3em 0;
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
