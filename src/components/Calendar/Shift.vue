<template>
  <div class="job">
    <span class="job__delete" @click="emit('delete')"><vue-feather type="x" size="0.8em"></vue-feather></span>
    <span class="job__edit"><vue-feather type="edit" size="0.8em"></vue-feather></span>
    <p class="job__title">{{ name }}</p>
    <p class="job__time">{{ startedAt.format('HH.mm') }} -
      {{ finishedAt.format('HH.mm') }}
      ({{ humanizeTime(Math.abs(startedAt.diff(finishedAt, 'hour', true))) }})</p>
    <p class="job__salary">
    </p>
  </div>
</template>

<script setup>
import VueFeather from 'vue-feather'
import { mapState } from '@/map'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  uuid: String,
  name: String,
  startedAt: Object,
  finishedAt: Object
})

const emit = defineEmits(['change', 'delete'])
const { salaryT } = mapState('user')
console.log(salaryT.value)

function humanizeTime (hours) {
  const n = new Date(0, 0)
  n.setSeconds(+hours * 60 * 60)
  return n.toTimeString().slice(0, 5)
}
</script>

<style scoped>

</style>
