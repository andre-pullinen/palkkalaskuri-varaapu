<template>
  <div class="percent-number">
    <button class="
      percent-number__controls
      percent-number--minus-control
    " v-if="hasControlInputs"
      @click.prevent="minusAction"
      @keyup.shift="onKeyupHandler"
    >{{ inc }}
      <vue-feather type="minus" size="1em"></vue-feather>
    </button>
    <input
      ref="input"
      class="percent-number__input"
      type="text"
      v-model="inputValue"
      @input="updateValue"
      @keydown="onKeydownHandler"
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
import { defineProps, defineEmits, ref, onUnmounted, nextTick } from 'vue'
import VueFeather from 'vue-feather'

const props = defineProps({
  modelValue: String,
  hasControlInputs: Boolean,
  max: Number,
  min: Number
})

const emit = defineEmits(['update:modelValue'])
const inputValue = ref(humanize(props.modelValue * 100))

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
  inputValue.value = humanize(targetValue)
  emit('update:modelValue', humanize((targetValue / 100)))
}

const inc = ref(5)
document.body.addEventListener('keydown', inc10Handler)
document.body.addEventListener('keyup', incResetHandler)
onUnmounted(() => {
  document.body.removeEventListener('keydown', inc10Handler)
})
function inc10Handler (event) {
  if (event.key === 'Control') {
    inc.value = 100
  }
}
function incResetHandler (event) {
  if (event.key === 'Control') {
    inc.value = 5
  }
}
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
async function onKeydownHandler (e) {
  await nextTick()
  console.log(e.target.value)
  if (e.key === 'Backspace' || e.key === 'Delete') {
    moveCursor(e.target, e.key === 'Delete' ? 1 : -1)
    // e.preventDefault() // Don't do anything to the input value
  }
}
function moveCursor (e, val) {
  e.focus()
  e.setSelectionRange(e.selectionStart + val, e.selectionStart + val)
}
function onKeyupHandler (e) {
  console.log(e)
}
function minusAction (e) {
  console.log('minus')
  let val = Number(Number(props.modelValue) - (e.shiftKey ? e.shiftKey && e.ctrlKey ? 10 : 0.1 : e.ctrlKey ? 1 : 0.05) / 100) * 100
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
function humanize (amount) {
  return addZeroes(evenRound(amount, 2))
}
function evenRound (num, decimalPlaces) {
  const d = decimalPlaces || 0
  const m = Math.pow(10, d)
  const n = +(d ? num * m : num).toFixed(8) // Avoid rounding errors
  const i = Math.floor(n)
  const f = n - i
  const e = 1e-8
  const r = (f > 0.5 - e && f < 0.5 + e)
    ? ((i % 2 === 0) ? i : i + 1) : Math.round(n)
  return d ? r / m : r
}
function addZeroes (num) {
  const dec = num.toString().split('.')[1]
  const len = dec && dec.length > 2 ? dec.length : 2
  return Number(num).toFixed(len)
}
</script>

<style lang="scss">
.percent-number {
  position: relative;
  display: flex;
  &__input, &__controls {
    transition: border-color .2s cubic-bezier(0.645, 0.045, 0.355, 1);
    padding: 0.5rem 0.7rem;
    font-size: 1rem;
    line-height: 1rem;
  }
  &__input {
    color: $input-color;
    flex-grow: 1;
    position: relative;
    text-align: center;
    border: none;
    border-bottom: 1px solid $border-input-color;
    border-top: 1px solid $border-input-color;
    &:focus {
      outline: none;
    }
  }
  &__controls {
    color: $input-color;
    border: 1px solid $border-input-color;
    border-radius: 4px;
    cursor: pointer;
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
    height: 2rem;
  }
}
</style>
