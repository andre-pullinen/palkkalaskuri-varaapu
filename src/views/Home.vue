<template>
  <div class="home">
    {{ t('main.hello') }}
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
