
<template>
  <Menubar class="w-full border-0" ref="menu">
    <template #start>
      <div class="navbar-logo"></div>
      <a
        v-if="$route.name !== 'home'"
        @click.prevent="toggleMenu"
        v-ripple
        class="flex items-center cursor-pointer pi pi-bars p-menubar-item-link"
      ></a>
    </template>
    <template #end>
      <div class="p-menubar-item-content">
        <a
          @click.prevent="$router.push('/')"
          v-ripple
          class="flex items-center cursor-pointer pi pi-home p-menubar-item-link"
        ></a>
      </div>
      <div v-if="authStore.user.id" class="p-menubar-item-content">
        <a
          @click.prevent="$router.push('/account')"
          v-ripple
          class="flex items-center cursor-pointer pi pi-user p-menubar-item-link"
        ></a>
      </div>
      <div class="p-menubar-item-content">
        <a
          v-if="!authStore.user.id"
          @click.prevent="login"
          v-ripple
          class="flex items-center cursor-pointer pi pi-sign-in p-menubar-item-link"
        ></a>
        <a
          v-if="authStore.user.id"
          @click.prevent="logout"
          v-ripple
          class="flex items-center cursor-pointer pi pi-sign-out p-menubar-item-link"
        ></a>
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const router = useRouter()
const authStore = useAuthStore()


const target = useTemplateRef('menu')

onClickOutside(target, event => {
  const layoutWrapper = document.querySelector('.layout-wrapper')
  if (window.innerWidth <= 991) {
    layoutWrapper.classList.remove('active-m-sidebar')
  }
})

const toggleMenu = () => {
  const layoutWrapper = document.querySelector('.layout-wrapper')
  if (window.innerWidth > 991) {
    layoutWrapper.classList.toggle('hidden-sidebar')
  } else {
    layoutWrapper.classList.toggle('active-m-sidebar')
  }
}

const login = () => {
  router.push({name: 'auth'})
}

const logout = () => {
  authStore.logoutUser()
}
</script>

<style lang="scss">
.p-menubar-end {
  display: flex;
}

.p-menubar {
  border: none !important;
}
</style>
