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
import { computed } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  uuid: String,
  name: String,
  startedAt: Object,
  finishedAt: Object
})

const emit = defineEmits(['salary', 'delete'])
const { salaryT } = mapState('user')
console.log(salaryT.value)

const salary = computed(() => {
  let start = props.startedAt
  const end = props.finishedAt
  const salaryInfo = salaryT.value

  let amount = 0
  while (start.diff(end) < 0) {
    let diff = start.diff(end, 'h', true)
    if (start.minute() !== 0) {
      diff = -(start.minute() / 60)
    }
    const weekday = start.weekday()
    const hour = start.hour()
    if (diff < 0 && diff > -1) {
      amount += salaryInfo.amount * Math.abs(diff)
    } else {
      amount += salaryInfo.amount
    }

    if (weekday === 0) {
      amount += salaryInfo.amount * salaryInfo.sundayPay
    }

    if (weekday === 6 && salaryInfo.saturdayTonightPay && hour >= 13) {
      amount += salaryInfo.saturdayTonightPay
    } else if (salaryInfo.isTonightPay && hour >= 18) {
      amount += salaryInfo.tonightPay
    }

    if (salaryInfo.isNightPay && hour < 6) {
      amount += salaryInfo.nightPay
    }
    if (start.minute() !== 0) {
      start = start.add(60 - start.minute(), 'm')
    } else {
      start = start.add(1, 'h')
    }
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

emit('salary', salary)
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
