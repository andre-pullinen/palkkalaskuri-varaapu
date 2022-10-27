<template>
  <div class="day" :class="{ 'day--inactive': isCurrentMonth }">
    <div class="day__border">
      <div class="day__border--top-left"></div>
      <div class="day__border--top-right"></div>
      <div class="day__border--bot-left"></div>
      <div class="day__border--bot-right"></div>
    </div>
    <span class="day__marker">
      {{ dayOfMonth }}
      <vue-feather class="day__marker-holiday" type="sun" size="0.8em" v-if="isHoliday"/>
      <vue-feather class="day__marker-holidayBank" type="cloud" size="0.8em" v-if="isBankHoliday"/>
    </span>
    <div class="day__content">
      <shift v-for="(shift, key) in shifts"
             :started-at="dayjs(shift.startedAt)"
             :finished-at="dayjs(shift.finishedAt)"
             :name="shift.name"
             :key="key"
             :uid="shift.uid"
             :work-time="shift.workTime"
             :finished-time-at="shift.finishedTimeAt"
             :started-time-at="shift.startedTimeAt"
             :work-hours="shift.workHours"
             :isLunch="shift.isLunch"
             :lunch-time="shift.lunchTime"
             @delete="deleteJob"
      />
    </div>
    <span class="day__add-job" @click="addShift"><vue-feather type="plus" size="1em"></vue-feather></span>
  </div>
</template>

<script setup>
import VueFeather from 'vue-feather'
import Shift from '@/components/Calendar/Shift'
import { inject } from 'vue'
import { mapActions } from '@/map'
import { event } from 'vue-gtag'

const dayjs = inject('dayJS')
const eventBus = inject('event')
const Holidays = inject('holidays')
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  dayOfMonth: Number,
  date: String,
  shifts: Object,
  isCurrentMonth: Boolean
})
const { removeJob } = mapActions('user')
const hd = new Holidays('fi')

const holiday = hd.isHoliday(props.date)

const isHoliday = holiday && holiday.some(e => e.type === 'public')
const isBankHoliday = holiday && holiday.some(e => e.type === 'bank')

function deleteJob (uid) {
  event('shift', {
    event_category: 'remove',
    event_label: props.date,
    value: props.date
  })
  removeJob({ uid, date: props.date })
}
function addShift () {
  eventBus.trigger('day.addShift', props.date)
}
</script>

<style lang="scss">
.day {
  margin:-1px 0 0 -1px;
  &__border {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    &--bot-left {
      position: absolute;
      bottom: 0;
      left: 0;
      height: .8rem;
      width: 1px;
      background-color: #ddd;
    }
    &--bot-right {
      position: absolute;
      bottom: 0;
      right: 0;
      height: .8rem;
      width: 1px;
      background-color: #ddd;
    }
  }
  border-collapse: collapse;
  position: relative;
  z-index: 1;
  flex-grow: 1;
  flex-basis: 0;
  max-width: 200px;
  min-height: 120px;
  padding: 2.2rem 0.9rem 1rem 0.9rem;
  border-bottom: 1px solid #ddd;
  &__content {
    position: relative;
    z-index: 1;
  }
  &__marker {
    position: absolute;
    z-index: 1;
    top: 5px;
    left: 0.9em;
    font-size: 1.2em;
    &-clear {
      color: red;
    }
    &-holiday {
      color: #d26e14;
    }
    &-holidayBank {
      color: #d26e14;
    }
  }
  &__add-job {
    position: absolute;
    z-index: 1;
    cursor: pointer;
    top: 5px;
    right: 0.9em;
    background-color: #007BFF;
    color: white;
    width: 1.265em;
    height: 1.265em;
    line-height: 1.55em;
    border-radius: 5px;
  }
}
</style>
