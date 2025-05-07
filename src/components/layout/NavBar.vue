
<template>
  <div class="card">
    <Menubar :model="items" class="menu">
      <template #start>
        <div class="navbar-logo"></div>
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex items-center" :class="item.icon" :href="item.url" v-bind="props.action">
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
          <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
          <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
        </a>
      </template>
      <template #end>
        <div v-if="authStore.user.id" class="p-menubar-item-content">
          <a
            @click.prevent="$router.push('/account')"
            v-ripple
            class="flex items-center cursor-pointer pi pi-user p-menubar-item-link"
          >
            My Account
          </a>
        </div>
        <div class="p-menubar-item-content">
          <a
            v-if="!authStore.user.id"
            @click.prevent="login"
            v-ripple
            class="flex items-center cursor-pointer pi pi-sign-in p-menubar-item-link"
          >
            Login
          </a>
          <a
            v-if="authStore.user.id"
            @click.prevent="logout"
            v-ripple
            class="flex items-center cursor-pointer pi pi-sign-out p-menubar-item-link"
          >
            Logout
          </a>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter()
const authStore = useAuthStore()

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    url: '/'
  },
])

const login = () => {
  router.push({name: 'auth'})
}

const logout = () => {
  authStore.logoutUser()
}
</script>

<style lang="scss">
.menu {
  padding-left: 40px !important;
  padding-right: 40px !important;
}
.p-menubar-end {
  display: flex;
}
</style>
