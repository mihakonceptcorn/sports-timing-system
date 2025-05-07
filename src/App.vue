<template>
  <NavBar />
  <RouterView />
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
