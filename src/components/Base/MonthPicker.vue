<template>
  <div class="month-picker">
    <div class="month-picker__control" @click="prevMonth">
      <vue-feather type="chevron-left" size="1.2em"></vue-feather>
    </div>
    <div class="month-picker__label">{{ names[value] }}</div>
    <div class="month-picker__control" @click="nextMonth">
      <vue-feather type="chevron-right" size="1.2em"></vue-feather>
    </div>
  </div>
</template>

<script setup>
import VueFeather from 'vue-feather'
import { computed } from 'vue'

const props = defineProps({
  modelValue: Number
})
const emit = defineEmits(['update:modelValue'])

const names = {
  1: 'Tammikuu',
  2: 'Helmikuu',
  3: 'Maliskuu',
  4: 'Huhtikuu',
  5: 'Toukokuu',
  6: 'Kesäkuu',
  7: 'Heinäkuu',
  8: 'Elokuu',
  9: 'Syyskuu',
  10: 'Lokakuu',
  11: 'Maraskuu',
  12: 'Joulukuu'
}
const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

function nextMonth () {
  if (value.value === 12) {
    value.value = 1
    return
  }
  value.value++
}
function prevMonth () {
  if (value.value === 1) {
    value.value = 12
    return
  }
  value.value--
}
</script>

<style scoped lang="scss">
.month-picker {
  display: flex;
  align-items: center;
  &__control, &__label {
    padding: 0.4em 0.6em;
  }
  &__control {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
