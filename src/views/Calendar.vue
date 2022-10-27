<template>
  <div class="calendar">
    <div class="calendar__date-picker">
      <year-picker v-model="year" />
      <month-picker v-model="month" />
    </div>
    <Periods v-for="(period, key, i) in periods" :weeks="period" :key="key" :class="i % 2 === 0 ? 'pink' : 'blue'" />
    <Modal
      v-model="isShow"
      :close="closeModal"
    >
      <div class="modal">
        <div class="add-shift">
          <h3 class="add-shift__title">{{ workDay.format('DD.MM.YYYY') }}</h3>
          <vue3-simple-typeahead
            id="typeahead_id"
            class="add-shift__input"
            placeholder="Paikkasi..."
            :items="store.getters['user/getJobPlaces']()"
            :minInputLength="1"
            @onInput="onInputEventHandler"
            @selectItem="selectItemEventHandler"
          />
          <Datepicker class="add-shift__input" v-model="workStarted" time-picker textInput modeHeight="120" />
          <Datepicker class="add-shift__input" v-model="workFinished" time-picker textInput modeHeight="120" />
          <checkbox v-model="isLunch">Ruokataukko</checkbox>
          <input class="add-shift__input add-shift__input-styled" type="number" v-model="lunchTime" v-if="isLunch">
        </div>
        <div class="add-shift__buttons">
          <button class="add-shift__button" @click="saveJob">
            save
          </button>
          <button class="add-shift__button" @click="closeModal">
            close
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, inject, reactive, ref } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import { useStore } from 'vuex'
// import WeekDays from '@/components/Calendar/WeekDays'
import Periods from '@/components/Calendar/Periods'
import Checkbox from '@/components/Base/Checkbox'
import MonthPicker from '@/components/Base/MonthPicker'
import YearPicker from '@/components/Base/YearPicker'
import { event } from 'vue-gtag'

const dayjs = inject('dayJS')
const eventBus = inject('event')

eventBus.on('day.addShift', showModal)

const store = useStore()
const now = dayjs()

const isShow = ref(false)
const isLunch = ref(false)
const lunchTime = ref(30)
const workName = ref('')
const workStarted = ref({
  hours: now.hour(),
  minutes: 0
})
const workFinished = ref({
  hours: now.add(6, 'h').hour(),
  minutes: 0
})
const workDay = ref(now)
const workFullTime = computed(() => {
  const startDay = workDay.value.hour(workStarted.value.hours).minute(workStarted.value.minutes)
  let finishDay = workDay.value.hour(workFinished.value.hours).minute(workFinished.value.minutes)
  if (workStarted.value.hours > workFinished.value.hours) {
    finishDay = finishDay.add(1, 'd')
  }
  return { startDay, finishDay }
})
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
    finishedAt: workFullTime.value.finishDay,
    isLunch: isLunch.value,
    lunchTime: lunchTime.value
  }
  event('shift', {
    event_category: 'create',
    event_label: payload.date,
    value: payload.date
  })
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
  console.log('lastDayOfTheMonthWeekday', lastDayOfTheMonthWeekday)
  const dayForNextWeek = 6 - (lastDayOfTheMonthWeekday === 6 ? 0 : lastDayOfTheMonthWeekday)
  console.log('dayForNextWeek', dayForNextWeek)
  return [...Array(dayForNextWeek + 1)].map((day, index) => {
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

const currentYear = ref(now.year())
const currentMonth = ref(now.month() + 1)
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
  console.log(daysInMouth)

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

<style lang="scss">
.calendar {
  &__date-picker {
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    justify-content: center;
  }
}
.simple-typeahead {
  &-input {
    box-sizing: border-box;
    width: 100%;
    font-size: 0.8em;
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color .2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover, &:focus-visible, &:focus {
      outline:none;
      border-color: #aaaeb7;
    }
  }
}
.add-shift {
  &__title {
    margin: 0;
  }
  &__input-styled {
    font-size: 0.8em;
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color .2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover, &:focus-visible, &:focus {
      outline:none;
      border-color: #aaaeb7;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__checkbox {
    & input[type='checkbox'] {
      /* Add if not using autoprefixer */
      -webkit-appearance: none;
      /* Remove most all native input styles */
      appearance: none;
      /* For iOS < 15 */
      background-color: rebeccapurple;
      /* Not removed via appearance */
      margin: 0;

      font: inherit;
      color: currentColor;
      width: 1.15em;
      height: 1.15em;
      border: 0.15em solid currentColor;
      border-radius: 0.15em;
      transform: translateY(-0.075em);

      display: grid;
      place-content: center;
      &::before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        transform: scale(0);
        transform-origin: bottom left;
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em var(--form-control-color);
        /* Windows High Contrast Mode */
        background-color: black;
      }
      &:checked::before {
        transform: scale(1);
      }
      &:focus {
        outline: max(2px, 0.15em) solid currentColor;
        outline-offset: max(2px, 0.15em);
      }
    }
  }
  &__input {
    box-sizing: border-box;
    width: 100%;
    margin: 10px 0;
  }
  &__buttons {
    border-top: 1px solid #ddd;
    margin-top: 10px;
    padding-top: 10px;
    display: flex;
  }
  &__button {
    background: none;
    flex-grow: 1;
    flex-basis: 0;
    font-size: 0.8em;
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    transition: border-color .2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:first-child {
      margin-right: 5px;
    }
    &:last-child {
      margin-left: 5px;
    }
    &:hover, &:focus-visible, &:focus {
      outline:none;
      border-color: #aaaeb7;
    }
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
