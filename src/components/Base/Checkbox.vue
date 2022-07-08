<template>
  <label class="checkbox" :class="{ 'checkbox--disabled': disabled }">
    <input type="checkbox" name="checkbox" v-model="value" />
    <slot></slot>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  disabled: Boolean
})
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val)
  }
})
</script>

<style scoped lang="scss">
.checkbox {
  line-height: 1.1;
  display: grid;
  grid-template-columns: 1em auto;
  gap: 0.5em;
  &--disabled {
    color: #959495;
    cursor: not-allowed;
  }
  & input[type="checkbox"] {
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    /* Remove most all native input styles */
    appearance: none;
    /* For iOS < 15 */
    // background-color: rebeccapurple;
    /* Not removed via appearance */
    margin: 0;

    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid currentColor;
    border-radius: 0.15em;
    transform: translateY(-0.075em);

    display: grid;
    place-content: center;
    &::before {
      content: "";
      width: 0.65em;
      height: 0.65em;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transform-origin: bottom left;
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em rebeccapurple;
      /* Windows High Contrast Mode */
      background-color: CanvasText;
    }
    &:checked::before {
      transform: scale(1);
    }
    :focus {
      outline: max(2px, 0.15em) solid currentColor;
      outline-offset: max(2px, 0.15em);
    }
  }
}
</style>
