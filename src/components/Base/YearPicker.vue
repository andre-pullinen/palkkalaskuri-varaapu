<template>
  <div class="year-picker">
    <div class="year-picker__control" @click="prevYear">
      <vue-feather type="chevron-left" size="1.2em"></vue-feather>
    </div>
    <div class="year-picker__label">{{ value }}</div>
    <div class="year-picker__control" @click="nextYear">
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

const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

function nextYear () {
  if (value.value === 2100) {
    return
  }
  value.value++
}
function prevYear () {
  if (value.value === 2000) {
    return
  }
  value.value--
}
</script>

<style scoped lang="scss">
.year-picker {
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
