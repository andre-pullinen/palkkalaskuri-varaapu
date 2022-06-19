<template>
  <div class="day">
    <span class="day__marker">{{ dayOfMonth }}</span>
    <shift v-for="(shift, key) in shifts"
           :started-at="dayjs(shift.startedAt)"
           :finished-at="dayjs(shift.finishedAt)"
           :name="shift.name"
           :key="key"
           :uuid="key"
           :work-time="shift.workTime"
           :finished-time-at="shift.finishedTimeAt"
           :started-time-at="shift.startedTimeAt"
           :work-hours="shift.workHours"
           @delete="deleteJob"
    />
    <span class="day__add-job" @click="addShift"><vue-feather type="plus" size="1em"></vue-feather></span>
  </div>
</template>

<script setup>
import VueFeather from 'vue-feather'
import Shift from '@/components/Calendar/Shift'
import { inject } from 'vue'
import { mapActions } from '@/map'

const dayjs = inject('dayJS')
const event = inject('event')
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  dayOfMonth: Number,
  date: String,
  shifts: Object
})
const { removeJob } = mapActions('user')

function deleteJob (uuid) {
  removeJob({ uuid, date: props.date })
}
function addShift () {
  event.trigger('day.addShift', props.date)
}
</script>

<style lang="scss">
.day {
  position: relative;
  flex-grow: 1;
  flex-basis: 0;
  height: 100px;
  padding-top: 2em;
  //background: rgba(213, 213, 213, 0.3);
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
</style>
