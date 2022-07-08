<template>
  <perfect-scrollbar ref="scroll">
  <div id="nav">
    <span v-for="(localRoute, index) in routes[0].children" :key="index">
      <router-link :to="{ name: localRoute.name, params: { lang: 'fi' } }">
        {{ localRoute.meta?.name || 'none' }}
      </router-link>
      <b v-if="index !== routes[0].children.length -1"> | </b>
    </span>
  </div>
  <router-view />
  </perfect-scrollbar>
</template>

<script setup>
import { onUnmounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import routes from '@/router/routes/main.route'

const route = useRoute()
const store = useStore()
const scroll = ref(null)

watch(() => route.name, () => {
  scroll.value.$el.scrollTop = 0
  scroll.value.update()
})

const zoomEvent = new Event('zoom')
const currentRatio = window.devicePixelRatio

function zoomHandler () {
  scroll.value.update()
}
function checkZooming () {
  if (currentRatio !== window.devicePixelRatio) {
    window.dispatchEvent(zoomEvent)
  }
}
function updateHandler () {
  store.dispatch('save')
}

window.addEventListener('beforeunload', updateHandler)
window.addEventListener('resize', checkZooming)
window.addEventListener('zoom', zoomHandler)

onUnmounted(() => {
  window.removeEventListener('beforeunload', updateHandler)
  window.removeEventListener('resize', checkZooming)
  window.removeEventListener('zoom', zoomHandler)
})
</script>

<style lang="scss">
#app, #modals {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.ps {
  height: 100vh;
  max-height: 100vh;
}
.vue-universal-modal {
  z-index: 999;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
