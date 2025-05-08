<template>
  <div class="account flex">
    <div class="card flex justify-start mt-6 ml-6">
      <Menu :model="items" />
    </div>
    <div class="card flex justify-center mt-6 ml-6 mr-6 w-full">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

const items = ref([
  {
    label: 'Dashboard',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-building-columns',
        command: () => {
          router.push({name: 'dashboard'})
        }
      },
    ]
  },
  {
    label: 'Competitions',
    items: [
      {
        label: 'Competitions',
        icon: 'pi pi-trophy',
        command: () => {
          router.push({name: 'competitions'})
        }
      },
      {
        label: 'Create',
        icon: 'pi pi-plus',
        command: () => {
          router.push({name: 'competition-create'})
        }
      },
      {
        label: 'Timekeeping',
        icon: 'pi pi-stopwatch',
        command: () => {
          router.push({name: 'timekeeping'})
        }
      },
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog'
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out'
      }
    ]
  }
]);
</script>

<style scoped lang="scss">

</style>
