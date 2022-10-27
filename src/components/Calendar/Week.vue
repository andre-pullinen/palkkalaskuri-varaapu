<template>
  <div class="week">
    <day v-for="(day, key) in days"
         :date="dayjs(day.date).format('YYYY-MM-DD')"
         :shifts="day.job"
         :day-of-month="day.dayOfMonth"
         :is-current-month="day.isCurrentMonth"
         :key="key"
    />
  </div>
</template>

<script setup>
import Day from '@/components/Calendar/Day'
import { inject } from 'vue'

const dayjs = inject('dayJS')

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  number: Number,
  days: Object
})
// const event = inject('event')
</script>

<style lang="scss">
.week {
  display: flex;
  flex-grow: 1;
  padding: 0 2em;
  justify-content: center;
}
</style>
