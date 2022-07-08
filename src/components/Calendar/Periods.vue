<template>
  <div class="period">
    <div class="period__weeks">
      <week v-for="(week, key) in weeks" :key="key" :number="week.weekNumber" :days="week.days" />
    </div>
    <div class="period__info">
      <div v-if="weeks.length === 2" class="period__wrapper">
        <div class="period__info-salary">
          <div class="salary__to-paid">{{ humanizeSalary(taxedSalary) }} €</div>
          <div class="salary__clear">{{ humanizeSalary(salary) }} €</div>
          <div class="salary__holiday">+ {{ humanizeSalary(holidayPay) }} €</div>
          <div class="salary__taxes">- {{ humanizeSalary(taxes) }} €</div>
        </div>
        <ul class="period__info-workTime">
          <li v-for="(time, key) in workTime" :key="key" class="workTime">
            <span class="workTime__title">{{workTimeNames[key]}}:</span>
            <span class="workTime__summary"><b>{{time}}</b></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import Week from '@/components/Calendar/Week'
import { computed } from 'vue'
import { mapState } from '@/map'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  weeks: Object
})
const workTimeNames = {
  usualHours: 'Yht.',
  tonightHours: 'Ilta',
  nightHours: 'Yö',
  saturdayHours: 'La',
  sundayHours: 'Su'
}
const { salaryT } = mapState('user')
const salary = computed(() => {
  const salaryInfo = salaryT.value

  const { usualHours, tonightHours, nightHours, saturdayHours, sundayHours } = workTime.value

  let amount = 0
  amount += usualHours * salaryInfo.amount
  amount += tonightHours * salaryInfo.tonightPay
  amount += nightHours * salaryInfo.nightPay
  amount += saturdayHours * salaryInfo.saturdayTonightPay
  amount += sundayHours * (salaryInfo.amount * salaryInfo.sundayPay)

  return amount
})
const holidaySalary = computed(() => {
  return salary.value + holidayPay.value
})
const holidayPay = computed(() => {
  const amount = Number(salary.value)
  const salaryInfo = salaryT.value

  return amount * salaryInfo.holidayPay
})
const taxes = computed(() => {
  const amount = Number(holidaySalary.value)
  const salaryInfo = salaryT.value

  return (amount * salaryInfo.tvak) + (amount * salaryInfo.evak) + (amount * salaryInfo.tax)
})
const taxedSalary = computed(() => {
  let amount = Number(salary.value)

  amount += holidayPay.value
  amount -= taxes.value

  return amount
})
const workTime = computed(() => {
  let usualHours = 0
  let tonightHours = 0
  let nightHours = 0
  let saturdayHours = 0
  let sundayHours = 0

  if (Object.entries(props.weeks).length > 0) {
    props.weeks.forEach((week) => {
      week.days.forEach((day) => {
        if (day.job && Object.entries(day.job).length > 0) {
          Object.values(day.job).forEach((shift) => {
            if (shift.workTime) {
              usualHours += shift.workTime.usualHours
              tonightHours += shift.workTime.tonightHours
              nightHours += shift.workTime.nightHours
              saturdayHours += shift.workTime.saturdayHours
              sundayHours += shift.workTime.sundayHours

              if (shift.isLunch) {
                usualHours -= (shift.lunchTime / 60)
              }
            }
          })
        }
      })
    })
  }
  usualHours = humanizeSalary(usualHours)
  tonightHours = humanizeSalary(tonightHours)
  nightHours = humanizeSalary(nightHours)
  saturdayHours = humanizeSalary(saturdayHours)
  sundayHours = humanizeSalary(sundayHours)

  return { usualHours, tonightHours, nightHours, saturdayHours, sundayHours }
})
function humanizeSalary (amount) {
  return addZeroes(evenRound(amount, 2))
}
function evenRound (num, decimalPlaces) {
  const d = decimalPlaces || 0
  const m = Math.pow(10, d)
  const n = +(d ? num * m : num).toFixed(8) // Avoid rounding errors
  const i = Math.floor(n)
  const f = n - i
  const e = 1e-8
  const r = (f > 0.5 - e && f < 0.5 + e)
    ? ((i % 2 === 0) ? i : i + 1) : Math.round(n)
  return d ? r / m : r
}
function addZeroes (num) {
  const dec = num.toString().split('.')[1]
  const len = dec && dec.length > 2 ? dec.length : 2
  return Number(num).toFixed(len)
}
</script>

<style lang="scss">
.salary {
  &__to-paid {
    font-weight: bold;
    font-size: 1.6em;
  }
  &__holiday, &__clear, &__taxes {
    font-size: 1em;
  }
}
.period {
  display: flex;
  align-self:stretch;
  &__wrapper {
    display: flex;
    align-self:stretch;
    justify-content: space-evenly;
    flex-direction: column;
  }
  &__weeks {
    flex-grow: 10;
    flex-basis: 0;
  }
  &__info-salary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  &__info-workTime {
    text-align: left;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  &__info {
    display: flex;
    align-self:stretch;
    flex-grow: 1;
    flex-basis: 0;
  }
}
.workTime {
  display: flex;
  &__title, &__summary {
    flex-grow: 1;
    flex-basis: 0;
  }
  &__title {
    // s
  }
  &__summary {
    // 7
  }
}
</style>
