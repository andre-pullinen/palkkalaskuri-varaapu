<template>
  <perfect-scrollbar ref="scroll">
  <navbar />
  <router-view />
  </perfect-scrollbar>
</template>

<script setup>
import { onUnmounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { auth as authService } from '@/firebase'
import Navbar from '@/components/Base/Navbar'
import { mapActions } from '@/map'

const route = useRoute()
const store = useStore()
const scroll = ref(null)

watch(() => route.name, () => {
  scroll.value.$el.scrollTop = 0
  scroll.value.update()
})

const zoomEvent = new Event('zoom')
const currentRatio = window.devicePixelRatio
const { auth } = mapActions('user')

authService.onAuthStateChanged(user => {
  if (user) {
    // User just signed in, we should not display dialog next time because of firebase auto-login
    console.log(user)
    // console.log(google.auth.getClient())
    auth({
      status: true,
      user:
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo:
          user.photoURL,
          token:
          user.accessToken
        }
    })
  } else {
    // User just signed-out or auto-login failed, we will show sign-in form immediately the next time he loads the page
    console.log('wwhoops')

    // Here implement logic to trigger the login dialog or redirect to sign-in page, if necessary. Don't redirect if dialog is already visible.
    // e.g. showDialog()
  }
})
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
* {
  box-sizing: border-box;
}
</style>
