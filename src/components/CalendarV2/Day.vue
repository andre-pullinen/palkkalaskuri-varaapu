<template>
  <div class="day">
    <div class="day__header">
      <div class="day__marker" :class="{ 'day__marker--today': today }">{{ number }}</div>
      <div class="day__additional-markers"></div>
      <div class="day__actions"></div>
    </div>
    <div class="day__body">
      <slot></slot>
    </div>
    <div class="day__footer"></div>
  </div>
</template>

<script setup>
defineProps({
  number: Number,
  today: Boolean
})
</script>

<style lang="scss" scoped>
.day {
  width: 100%;
  min-height: 100px;
  &__marker {
    &--today {
      font-weight: bold;
    }
  }
  &__header, &__body, &__footer {
    width: 100%;
  }
  &__header {
    display: grid;
    grid-template-columns: 20px 1fr 20px;
  }
}
</style>
