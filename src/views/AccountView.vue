<template>
  <div class="layout-sidebar bg-surface-0 dark:bg-surface-900">
    <Menu :model="items" class="mt-4 pb-4" />
  </div>
  <div class="layout-main-container">
    <div>
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' });

const items = computed(() => [
  {
    label: 'Menu',
    items: [
      {
        label: t('sideBar.dashboard'),
        icon: 'pi pi-building-columns',
        command: () => {
          router.push({name: 'dashboard'})
        }
      },
    ]
  },
  {
    label: t('sideBar.competitions'),
    items: [
      {
        label: t('sideBar.competitions'),
        icon: 'pi pi-trophy',
        command: () => {
          router.push({name: 'competitions'})
        }
      },
      {
        label: t('sideBar.create'),
        icon: 'pi pi-plus',
        command: () => {
          router.push({name: 'competition-create'})
        }
      },
      {
        label: t('sideBar.timekeeping'),
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
      }
    ]
  }
])


// const items = ref([
//   {
//     label: 'Dashboard',
//     items: [
//       {
//         label: 'Dashboard',
//         icon: 'pi pi-building-columns',
//         command: () => {
//           router.push({name: 'dashboard'})
//         }
//       },
//     ]
//   },
//   {
//     label: 'Competitions',
//     items: [
//       {
//         label: 'Competitions',
//         icon: 'pi pi-trophy',
//         command: () => {
//           router.push({name: 'competitions'})
//         }
//       },
//       {
//         label: 'Create',
//         icon: 'pi pi-plus',
//         command: () => {
//           router.push({name: 'competition-create'})
//         }
//       },
//       {
//         label: 'Timekeeping',
//         icon: 'pi pi-stopwatch',
//         command: () => {
//           router.push({name: 'timekeeping'})
//         }
//       },
//     ]
//   },
//   {
//     label: 'Profile',
//     items: [
//       {
//         label: 'Settings',
//         icon: 'pi pi-cog'
//       },
//       {
//         label: 'Logout',
//         icon: 'pi pi-sign-out'
//       }
//     ]
//   }
// ]);
</script>

<style scoped lang="scss">

</style>
