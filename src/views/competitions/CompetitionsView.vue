<template>
  <div class="competitions-view w-full">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
        {{ locale === 'ua' ? 'Змагання' : 'Competitions' }}
      </h2>
      <div class="flex items-center gap-2 flex-wrap">
        <Button
          @click="$router.push({ name: 'competition-create' })"
          :label="locale === 'ua' ? 'Створити' : 'Create'"
          icon="pi pi-plus"
          size="small"
        />
        <Button
          v-if="isDev"
          @click="generateDemoData"
          :loading="isSeeding"
          :label="locale === 'ua' ? 'Згенерувати демо (4 турніри)' : 'Generate demo (4 types)'"
          icon="pi pi-bolt"
          severity="help"
          size="small"
          outlined
        />
        <Button
          v-if="isDev && hasDemoTournaments"
          @click="cleanDemoData"
          :loading="isCleaning"
          :label="locale === 'ua' ? 'Видалити демо' : 'Delete demo'"
          icon="pi pi-trash"
          severity="danger"
          size="small"
          text
        />
      </div>
    </div>

    <Card v-if="competitionsStore.competitions.length" class="mb-6">
      <template #content>
        <DataTable
          v-model:selection="selectedCompetitions"
          :value="competitionsStore.competitions"
          dataKey="id"
          tableStyle="min-width: 15rem"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="id" header="Id">
            <template #body="slotProps">
              <a
                @click.prevent="goToPreview(slotProps.data.id)"
                class="text-green-600 cursor-pointer"
              >
                {{ slotProps.data.id.slice(0, 5) + '...' }}
              </a>
            </template>
          </Column>
          <Column field="name" header="Name"></Column>
          <Column field="date" header="Date">
            <template #body="slotProps">
              {{ getDate(slotProps.data.date) }}
            </template>
          </Column>
          <Column field="country" header="Country"></Column>
          <Column field="city" header="City"></Column>
          <Column field="location" header="Location"></Column>
          <Column field="type" header="Type">
            <template #body="slotProps">
              {{ competitionTypeLabel(slotProps.data.type, { short: true, locale }) }}
            </template>
          </Column>
          <Column field="action" header="Actions">
            <template #body="slotProps">
              <div style="min-width: 72px">
                <Button
                  icon="pi pi-pencil"
                  rounded
                  aria-label="Filter"
                  variant="outlined"
                  size="small"
                  @click.prevent="goToEdit(slotProps.data.id)"
                />
                <Button
                  @click.prevent="confirmDialog(slotProps.data.id, slotProps.data.name)"
                  icon="pi pi-times"
                  rounded
                  aria-label="Filter"
                  variant="outlined"
                  size="small"
                  severity="danger"
                  class="ml-2"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Card v-else class="mb-6">
      <template #title>
        {{ locale === 'ua' ? 'Тут ще немає змагань' : 'There are no competitions here yet' }}
      </template>
      <template #content>
        <p class="text-surface-600 dark:text-surface-400 mb-4">
          {{ locale === 'ua' ? 'Створіть своє перше змагання або натисніть кнопку нижче, щоб миттєво згенерувати всі 4 типи турнірів із заповненими результатами для тестування.' : 'Create your first competition or click the button below to immediately generate all 4 tournament formats with pre-filled results for testing.' }}
        </p>
        <div class="flex gap-2 flex-wrap">
          <Button
            @click="$router.push({ name: 'competition-create' })"
            :label="locale === 'ua' ? 'Створити змагання' : 'Create competition'"
            icon="pi pi-plus"
            size="small"
          />
          <Button
            v-if="isDev"
            @click="generateDemoData"
            :loading="isSeeding"
            :label="locale === 'ua' ? 'Згенерувати демо (4 турніри)' : 'Generate demo (4 types)'"
            icon="pi pi-bolt"
            severity="help"
            size="small"
          />
        </div>
      </template>
    </Card>

    <Toast position="bottom-right"/>
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useAuthStore } from '@/stores/auth.js'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { competitionTypeLabel } from '@/constants/competitionTypes'
import { seedDemoTournaments, deleteDemoTournaments } from '@/utils/seedDemoTournaments'

const competitionsStore = useCompetitionsStore()
const authStore = useAuthStore()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const { locale } = useI18n()

const isDev = import.meta.env.DEV

const selectedCompetitions = ref()
const isSeeding = ref(false)
const isCleaning = ref(false)
let deleteId = null

const hasDemoTournaments = computed(() => {
  return competitionsStore.competitions.some((c) => c.isDemo || c.name?.startsWith('[DEMO]'))
})

const generateDemoData = async () => {
  if (!authStore.user?.id) {
    toast.add({
      severity: 'warn',
      summary: 'Увага',
      detail: 'Будь ласка, увійдіть в акаунт перед створенням даних',
      life: 3000,
    })
    return
  }

  isSeeding.value = true
  try {
    const ids = await seedDemoTournaments(authStore.user.id)
    toast.add({
      severity: 'success',
      summary: 'Готово!',
      detail: `Створено 4 демо-турніри (${ids.length} шт.) із результатами`,
      life: 4000,
    })
  } catch (error) {
    console.error('Failed to seed demo data:', error)
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося згенерувати демо-дані: ' + error.message,
      life: 4000,
    })
  } finally {
    isSeeding.value = false
  }
}

const cleanDemoData = async () => {
  if (!authStore.user?.id) return

  isCleaning.value = true
  try {
    const count = await deleteDemoTournaments(authStore.user.id)
    toast.add({
      severity: 'info',
      summary: 'Очищено',
      detail: `Видалено ${count} демо-турнірів`,
      life: 3000,
    })
  } catch (error) {
    console.error('Failed to clean demo data:', error)
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося видалити демо-дані: ' + error.message,
      life: 4000,
    })
  } finally {
    isCleaning.value = false
  }
}

const confirmDialog = (id, name) => {
  deleteId = id
  confirm.require({
    message: `Do you want to delete '${name}'?`,
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      competitionsStore.deleteCompetition(deleteId)
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
      deleteId = null
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
      deleteId = null
    },
    onHide: () => {
      deleteId = null
    }
  });
};

const getDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}
const goToPreview = (id) => {
  router.push({name: 'competition-preview', params: { id }})
}

const goToEdit = (id) => {
  router.push({name: 'competition-edit', params: { id }})
}

</script>

<style scoped lang="scss">

</style>
