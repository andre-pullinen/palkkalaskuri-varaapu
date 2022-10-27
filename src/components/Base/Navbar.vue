<template>
  <header class="header">
    <nav class="header__navigation">
      <ul class="navigation__links">
        <li v-for="(localRoute, index) in routes[0].children" :key="index">
          <router-link :to="{ name: localRoute.name, params: { lang: 'fi' } }">
            {{ localRoute.meta?.name || 'undefined name' }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="header__user-bar">
      <user-bar :is-auth="isAuth" :photo="auth.photo" :name="auth.name" :email="auth.email" />
    </div>
  </header>
</template>

<script setup>
import routes from '@/router/routes/main.route'
import { mapState } from '@/map'
import UserBar from '@/components/UserBar'

const { isAuth, auth } = mapState('user')
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 2rem;
  box-shadow: 0 0 3px $shadow-color;
  box-sizing: border-box;
  &__user-bar {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.navigation {
  &__links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    height: 100%;
    margin: 0;
    padding: 0;
    & li {
      text-decoration: none;
      &:not(&:last-child) {
        margin-right: 1rem;
      }
      &:not(&:first-child) {
        margin-left: 1rem;
      }
      & a {
        color: $navbar-link-color;
        text-decoration: none;
        &:hover {
          color: $navbar-link-hover-color;
        }
      }
    }
  }
}
.router-link-exact-active {
  color: $navbar-link-active-color !important;
  font-weight: bold;
}
</style>
