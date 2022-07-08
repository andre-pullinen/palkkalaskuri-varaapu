<template>
  <div class="week-days">
    <div class="week-days__number"></div>
    <div class="week-days__days">
      <div class="day-of-week" v-for="n in 7" :key="n">
        {{ n }}
      </div>
    </div>
    <div class="week-days__blum"></div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.week-days {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__number, &__blum {
    flex-grow: 0;
  }
  &__days {
    display: flex;
    flex-grow: 1;
    padding: 0 2em;
    justify-content: center;
  }
}
.day-of-week {
  flex-grow: 1;
  flex-basis: 0;
  max-width: 200px;
}
</style>
