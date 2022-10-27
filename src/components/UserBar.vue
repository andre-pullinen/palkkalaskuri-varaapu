<template>
  <div class="user-bar">
    <div class="user-bar__info">
      <div class="user-bar__name" v-if="isAuth">{{ name }}</div>
      <div class="user-bar__email" v-if="isAuth">{{ email }}</div>
      <button class="user-bar__auth-btn" @click.prevent="googleSignIn" v-if="!isAuth">Kirjaudu sisään</button>
    </div>
    <div class="user-bar__photo">
      <img :src="photo" alt="User Info" v-if="isAuth">
      <div v-if="!isAuth">
        <vue-feather type="user" size="1.5em" />
      </div>
    </div>
  </div>
</template>

<script setup>
import VueFeather from 'vue-feather'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth as authentication } from '@/firebase'
import { mapActions } from '@/map'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  isAuth: Boolean,
  photo: String,
  name: String,
  email: String
})

const { auth } = mapActions('user')

function googleSignIn () {
  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/calendar')

  signInWithPopup(authentication, provider)
    .then((result) => {
      // const credential = GoogleAuthProvider.credentialFromResult(result)
      const user = result.user
      // console.log(google.auth.getClient())
      auth({
        status: true,
        user:
          {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            token: user.accessToken
          }
      })
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)

      console.log(errorCode, errorMessage, email, credential)
    })
}
</script>

<style lang="scss">
.user-bar {
  display: flex;
  color: $input-color;
  &__photo {
    height: 40px;
    width: 40px;
    border: 1px solid $border-input-color;
    border-radius: 0 40px 40px 0;
    overflow: hidden;
    font-size: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid $border-input-color;
    border-right: none;
    border-radius: 40px 0 0 40px;
    text-align: left;
    padding: 0 0.8rem 0 1rem;
  }
  &__auth-btn {
    background-color: transparent;
    cursor: pointer;
    border: none;
    height: 100%;
  }
  &__email {
    color: #414141;
    font-size: 0.8rem;
  }
}
</style>
