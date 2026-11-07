<template>
  <div class="competitors mt-6">
    <DataTable
      v-model:selection="selectedStages"
      :value="stagesStore.stages"
      dataKey="id"
      tableStyle="min-width: 15rem"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="id" header="Id">
        <template #body="slotProps">
          <a
            @click.prevent="$router.push({ name: 'stage-preview', params: { id: $route.params.id, stageId: slotProps.data.id } })"
            class="text-green-600 cursor-pointer"
          >
            {{ slotProps.data.id.slice(0, 5) + '...' }}
          </a>
        </template>
      </Column>
      <Column field="number" :header="locale === 'ua' ? '№' : 'Number'" sortable style="width: 4rem"></Column>
      <Column field="name" :header="locale === 'ua' ? 'Назва етапу' : 'Name'">
        <template #body="slotProps">
          <a
            @click.prevent="$router.push({ name: 'stage-preview', params: { id: $route.params.id, stageId: slotProps.data.id } })"
            class="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>{{ slotProps.data.name }}</span>
            <i class="pi pi-chevron-right text-xs"></i>
          </a>
        </template>
      </Column>
      <Column field="role" :header="locale === 'ua' ? 'Роль / Тип' : 'Role'">
        <template #body="slotProps">
          <Tag :value="roleLabel(slotProps.data.role)" severity="secondary" class="text-xs" />
        </template>
      </Column>
      <Column field="action" :header="locale === 'ua' ? 'Дії' : 'Actions'" headerStyle="width: 8rem">
        <template #body="slotProps">
          <div class="flex items-center gap-1">
            <Button
              icon="pi pi-arrow-right"
              rounded
              variant="outlined"
              size="small"
              :title="locale === 'ua' ? 'Перейти до етапу' : 'Open stage'"
              @click.prevent="$router.push({ name: 'stage-preview', params: { id: $route.params.id, stageId: slotProps.data.id } })"
            />
            <Button
              icon="pi pi-pencil"
              rounded
              variant="outlined"
              size="small"
              severity="secondary"
              :title="locale === 'ua' ? 'Редагувати' : 'Edit'"
              @click.prevent="goToEdit(slotProps.data.id)"
            />
            <Button
              @click.prevent="confirmDialog(slotProps.data.id, slotProps.data.name)"
              icon="pi pi-trash"
              rounded
              variant="outlined"
              size="small"
              severity="danger"
              :title="locale === 'ua' ? 'Видалити' : 'Delete'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useStagesStore } from '@/stores/stages.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { getRoleLabel } from '@/constants/competitionTypes'

const stagesStore = useStagesStore()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const { locale } = useI18n()

const selectedStages = ref()
let deleteId = null

const roleLabel = (role) => getRoleLabel(role, locale.value)

const goToEdit = (id) => {
  router.push({name: 'stage-edit', params: { stageId: id }})
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
      stagesStore.deleteStage(deleteId)
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
  })
}
</script>

<style scoped lang="scss">

</style>
