<template>
  <div class="layout-wrapper layout-static bg-surface-100 dark:bg-gray-800">
    <div class="fixed w-full border-r-0 pl-6 pr-6 bg-surface-100 dark:bg-surface-900">
      <NavBar />
    </div>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/layout/NavBar.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

onMounted(() => {
  authStore.init()
})
</script>
