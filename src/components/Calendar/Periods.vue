<template>
  <div class="period">
    <div class="period__weeks">
      <week v-for="(week, key) in weeks" :key="key" :number="week.weekNumber" :days="week.days" />
    </div>
    <div class="period__info">
      <div v-if="weeks.length === 2" class="period__wrapper">
        <div class="period__info-salary">{{ salary }} €</div>
        <ul class="period__info-workTime">
          <li v-for="(time, key) in workTime" :key="key">
            {{workTimeNames[key]}}: <b>{{time}}</b>
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
  usualHours: 'Yhteensä',
  tonightHours: 'Ilta-tunnit',
  nightHours: 'Yö-tunnit',
  saturdayHours: 'Lauantai-tunnit',
  sundayHours: 'Sunnuntai-tunnit'
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

  if (props.isHolidayPay) {
    amount += amount * salaryInfo.holidayPay
  }
  if (props.isTaxed) {
    amount = amount - (amount * salaryInfo.tvak) - (amount * salaryInfo.evak) - (amount * salaryInfo.tax)
  }
  return humanizeSalary(amount)
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
            usualHours += shift.workTime.usualHours
            tonightHours += shift.workTime.tonightHours
            nightHours += shift.workTime.nightHours
            saturdayHours += shift.workTime.saturdayHours
            sundayHours += shift.workTime.sundayHours
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
  return Math.round(amount * 100) / 100
}
</script>

<style lang="scss">
.period {
  display: flex;
  align-self:stretch;
  &:not(&:last-child) {
    border-bottom: 1px solid black;
  }
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
    font-weight: bold;
    font-size: 1.6em;
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
</style>
