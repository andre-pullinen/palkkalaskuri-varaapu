<template>
  <div class="month">
    <div class="month__header">
      <div class="month__week-day" v-for="dayOfWeek in daysOfWeek" :key="dayOfWeek">{{ dayOfWeek }}</div>
    </div>
    <div class="month__body">
      <slot></slot>
    </div>
    <div class="month__footer"></div>
  </div>
</template>

<script setup>
const daysOfWeek = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'Su', 'La']
</script>

<style lang="scss" scoped>
.month {
  &__header, &__body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
