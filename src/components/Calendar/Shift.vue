<template>
  <div class="job">
    <span class="job__delete" @click="emit('delete', uuid)"><vue-feather type="x" size="0.8em"></vue-feather></span>
    <span class="job__edit"><vue-feather type="edit" size="0.8em"></vue-feather></span>
    <p class="job__title">{{ name }}</p>
    <p class="job__time">{{ startedAt.format('HH.mm') }} -
      {{ finishedAt.format('HH.mm') }}
      ({{ humanizeTime(Math.abs(startedAt.diff(finishedAt, 'hour', true))) }})</p>
    <p class="job__salary">
      {{ humanizeSalary(salary) }} €
    </p>
  </div>
</template>

<script setup>
import VueFeather from 'vue-feather'
import { mapState } from '@/map'
import { computed, inject } from 'vue'

const event = inject('event')

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  uuid: String,
  name: String,
  isHolidayPay: Boolean,
  isTaxed: Boolean,
  startedAt: Object,
  finishedAt: Object
})

const emit = defineEmits(['shiftInfo', 'delete'])
const { salaryT } = mapState('user')

const workTime = computed(() => {
  let usualHours = 0
  let tonightHours = 0
  let nightHours = 0
  let saturdayHours = 0
  let sundayHours = 0

  let start = props.startedAt
  const end = props.finishedAt

  while (start.diff(end) < 0) {
    const weekday = start.weekday()
    const hour = start.hour()
    let diff = start.diff(end, 'h', true)
    if (start.minute() !== 0) {
      diff = -(Math.round((1 - (start.minute() / 60)) * 100) / 100)
      console.log('diffTime', diff)
    }
    let exponent = 1
    if (diff < 0 && diff > -1) {
      exponent = Math.abs(diff)
    }

    usualHours += exponent

    if (weekday === 0) {
      sundayHours += exponent
    }
    if (weekday === 6 && hour >= 13) {
      saturdayHours += exponent
    } else if (hour >= 18) {
      tonightHours += exponent
    }

    if (hour < 6) {
      nightHours += exponent
    }

    if (start.minute() !== 0) {
      start = start.add(60 - start.minute(), 'm')
    } else {
      start = start.add(1, 'h')
    }
  }

  return { usualHours, tonightHours, nightHours, saturdayHours, sundayHours }
})
console.table(props.startedAt.format('YYYY MM DD'))
console.table(workTime.value)
const salary = computed(() => {
  const salaryInfo = salaryT.value

  const { usualHours, tonightHours, nightHours, saturdayHours, sundayHours } = workTime.value

  let amount = 0
  amount += usualHours * salaryInfo.amount
  amount += tonightHours * salaryInfo.tonightPay
  amount += nightHours * salaryInfo.nightPay
  amount += saturdayHours * salaryInfo.saturdayTonightPay
  amount += sundayHours * (salaryInfo.amount * salaryInfo.sundayPay)

  if (props.isHolidayPay) {
    amount += amount * salaryInfo.holidayPay
  }
  if (props.isTaxed) {
    amount = amount - (amount * salaryInfo.tvak) - (amount * salaryInfo.evak) - (amount * salaryInfo.tax)
  }
  return amount
})

function humanizeTime (hours) {
  const n = new Date(0, 0)
  n.setSeconds(+hours * 60 * 60)
  return n.toTimeString().slice(0, 5)
}

function humanizeSalary (amount) {
  return Math.round(amount * 100) / 100
}

event.trigger('shift.salary', { salary, workTime })
</script>

<style lang="scss">
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
</style>
