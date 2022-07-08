<template>
  <div class="week">
    <div class="week__number">#{{ number }}</div>
    <div class="week__days">
      <day v-for="(day, key) in days"
           :date="dayjs(day.date).format('YYYY-MM-DD')"
           :shifts="day.job"
           :day-of-month="day.dayOfMonth"
           :is-current-month="day.isCurrentMonth"
           :key="key"
      />
    </div>
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
  align-items: center;
  justify-content: space-between;
  &__number {
    font-size: 48px;
    font-weight: 300;
    color: #5f5f5f;
    flex-grow: 0;
  }
  &__days {
    display: flex;
    flex-grow: 1;
    padding: 0 2em;
    justify-content: center;
  }
}
</style>
