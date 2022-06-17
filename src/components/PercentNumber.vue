<template>
  <div class="percent-number">
    <button class="
      percent-number__controls
      percent-number--minus-control
    " v-if="hasControlInputs"
      @click.prevent="minusAction"
    >
      <vue-feather type="minus" size="1em"></vue-feather>
    </button>
    <input
      ref="input"
      class="percent-number__input"
      type="text"
      :value="value"
      @input="updateValue"
    />
    <button class="
      percent-number__controls
      percent-number--plus-control
    " v-if="hasControlInputs"
      @click.prevent="plusAction"
    >
      <vue-feather type="plus" size="1em"></vue-feather>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import VueFeather from 'vue-feather'

const props = defineProps({
  modelValue: String,
  hasControlInputs: Boolean,
  max: Number,
  min: Number
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  let targetValue = Number(event.target.value)
  const max = Number(props.max)
  const min = Number(props.min)

  if (targetValue > max) {
    targetValue = props.max
  }
  if (targetValue < min) {
    targetValue = props.min
  }
  emit('update:modelValue', (targetValue / 100).toFixed(4))
}

const value = computed({
  get: () => Math.round(props.modelValue * 10000) / 100,
  set: val => {}
})

function plusAction (e) {
  console.log('plussa')
  let val = Number(Number(props.modelValue) + (e.shiftKey ? e.shiftKey && e.altKey ? 10 : 0.1 : e.altKey ? 1 : 0.05) / 100) * 100
  const max = Number(props.max)
  const min = Number(props.min)

  if (val > max) {
    val = props.max
  }
  if (val < min) {
    val = props.min
  }
  emit('update:modelValue', (val / 100).toFixed(4))
}
function minusAction (e) {
  console.log('minus')
  let val = Number(Number(props.modelValue) - (e.shiftKey ? e.shiftKey && e.altKey ? 10 : 0.1 : e.altKey ? 1 : 0.05) / 100) * 100
  const max = Number(props.max)
  const min = Number(props.min)

  if (val > max) {
    val = props.max
  }
  if (val < min) {
    val = props.min
  }
  emit('update:modelValue', (val / 100).toFixed(4))
}

</script>

<style lang="scss">
.percent-number {
  position: relative;
  display: inline-block;
  &__input {
    position: relative;
    text-align: center;
    font-size: 1em;
    line-height: 1em;
    padding: 0.5em 0.7em;
    border: none;
    border-bottom: 1px solid #5f5f5f;
    border-top: 1px solid #5f5f5f;
    &:focus {
      outline: none;
    }
  }
  &__controls {
    font-size: 1em;
    line-height: 1em;
    padding: 0.5em 0.7em;
    border: 1px solid #5f5f5f;
  }
  &--minus-control {
    border-radius: 5px 0 0 5px;
  }
  &--plus-control {
    border-radius: 0 5px 5px 0;
  }
  &__controls, &__input {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    height: 2em;
  }
}
</style>
