<template>
  <div>
    <Calendar.Month>
      <Calendar.Day
        v-for="(day, index) in days"
        :number="day.number"
        :today="day.number === now.date()"
        :key="index"
      ></Calendar.Day>
    </Calendar.Month>
  </div>
</template>

<script setup>
import * as Calendar from '@/components/CalendarV2'
import { getDaysForDate } from '@/calendar'
import { inject } from 'vue'
const dayjs = inject('dayJS')
const now = dayjs()
const days = getDaysForDate(now)
</script>

<style scoped>

</style>
