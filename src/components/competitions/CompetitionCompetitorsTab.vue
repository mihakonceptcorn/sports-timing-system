<template>
  <div class="competition-competitors-tab">
    <!-- Top toolbar of competitors tab -->
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div class="flex items-center gap-3">
        <span class="text-sm font-semibold text-surface-700 dark:text-surface-300">
          {{ locale === 'ua' ? 'Всього унікальних учасників:' : 'Total unique competitors:' }}
        </span>
        <Badge :value="uniqueCompetitors.length" severity="info" />
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            :placeholder="locale === 'ua' ? 'Пошук за прізвищем/номером...' : 'Search by name/number...'"
            size="small"
            class="w-48 sm:w-60"
          />
        </IconField>

        <Button
          @click="openAddDialog"
          :label="locale === 'ua' ? 'Додати учасника' : 'Add competitor'"
          icon="pi pi-user-plus"
          size="small"
        />
      </div>
    </div>

    <!-- Empty state when no stages exist -->
    <Message v-if="stages.length === 0" severity="warn" :closable="false" class="mb-4">
      {{ locale === 'ua'
        ? 'У змаганні ще немає жодного етапу. Спочатку створіть етап у вкладці «Етапи», щоб додати учасників.'
        : 'There are no stages in this competition yet. Please create a stage in the "Stages" tab first.' }}
    </Message>

    <!-- Table of unique competitors -->
    <DataTable
      :value="filteredCompetitors"
      dataKey="competitorNumber"
      tableStyle="min-width: 20rem"
      paginator
      :rows="15"
      size="small"
      stripedRows
    >
      <template #empty>
        <div class="text-center py-8 text-surface-500 dark:text-surface-400">
          <i class="pi pi-users text-4xl mb-3 block opacity-50"></i>
          <p class="font-medium">
            {{ locale === 'ua' ? 'Учасників ще не додано або нічого не знайдено' : 'No competitors added or found' }}
          </p>
          <Button
            v-if="stages.length > 0"
            @click="openAddDialog"
            :label="locale === 'ua' ? 'Додати першого учасника' : 'Add first competitor'"
            icon="pi pi-user-plus"
            size="small"
            class="mt-3"
            outlined
          />
        </div>
      </template>

      <Column field="competitorNumber" :header="locale === 'ua' ? '№' : 'Num'" sortable style="width: 5rem">
        <template #body="{ data }">
          <span class="font-mono font-bold text-primary-600 dark:text-primary-400">
            #{{ data.competitorNumber ?? '—' }}
          </span>
        </template>
      </Column>

      <Column field="fullName" :header="locale === 'ua' ? 'ПІБ' : 'Full Name'" sortable>
        <template #body="{ data }">
          <span class="font-semibold text-surface-900 dark:text-surface-0">
            {{ data.secondName }} {{ data.name }}
          </span>
        </template>
      </Column>

      <Column field="category" :header="locale === 'ua' ? 'Категорія' : 'Category'" sortable>
        <template #body="{ data }">
          <Tag :value="data.category || '—'" severity="secondary" class="uppercase text-xs" />
        </template>
      </Column>

      <Column field="gender" :header="locale === 'ua' ? 'Стать' : 'Gender'">
        <template #body="{ data }">
          <span class="text-sm text-surface-600 dark:text-surface-400">
            {{ data.gender || '—' }}
          </span>
        </template>
      </Column>

      <Column field="team" :header="locale === 'ua' ? 'Команда' : 'Team'">
        <template #body="{ data }">
          <span class="text-sm text-surface-600 dark:text-surface-400">
            {{ data.team || '—' }}
          </span>
        </template>
      </Column>

      <Column :header="locale === 'ua' ? 'Етапи' : 'Stages'">
        <template #body="{ data }">
          <div class="flex items-center gap-1 flex-wrap">
            <span
              v-for="stg in data.stagesList"
              :key="stg.id"
              class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700"
            >
              {{ stg.name || ('Stage ' + stg.number) }}
            </span>
          </div>
        </template>
      </Column>

      <Column :header="locale === 'ua' ? 'Дії' : 'Actions'" headerStyle="width: 7rem">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <Button
              v-if="data.primaryRecord"
              icon="pi pi-pencil"
              rounded
              variant="outlined"
              size="small"
              severity="secondary"
              :title="locale === 'ua' ? 'Редагувати' : 'Edit'"
              @click.prevent="goToEditCompetitor(data.primaryRecord)"
            />
            <Button
              icon="pi pi-trash"
              rounded
              variant="outlined"
              size="small"
              severity="danger"
              :title="locale === 'ua' ? 'Видалити з турніру' : 'Delete'"
              @click.prevent="confirmDeleteCompetitor(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog for Adding Competitor -->
    <Dialog
      v-model:visible="addDialogVisible"
      modal
      :header="locale === 'ua' ? 'Додати учасника до змагання' : 'Add competitor to competition'"
      :style="{ width: '32rem', maxWidth: '95vw' }"
    >
      <div class="flex flex-col gap-3 py-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label for="name" class="font-semibold text-sm">{{ locale === 'ua' ? "Ім'я *" : 'First Name *' }}</label>
            <InputText v-model="formData.name" id="name" :placeholder="locale === 'ua' ? 'Іван' : 'John'" />
          </div>

          <div class="flex flex-col gap-1">
            <label for="secondName" class="font-semibold text-sm">{{ locale === 'ua' ? 'Прізвище *' : 'Last Name *' }}</label>
            <InputText v-model="formData.secondName" id="secondName" :placeholder="locale === 'ua' ? 'Коваленко' : 'Doe'" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label for="competitorNumber" class="font-semibold text-sm">
              {{ locale === 'ua' ? 'Стартовий номер *' : 'Number *' }}
            </label>
            <InputNumber
              v-model="formData.competitorNumber"
              id="competitorNumber"
              :placeholder="locale === 'ua' ? 'Наприклад: 101' : 'e.g. 101'"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-semibold text-sm">{{ locale === 'ua' ? 'Стать' : 'Gender' }}</label>
            <Select
              v-model="formData.gender"
              :options="genderOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="locale === 'ua' ? 'Оберіть стать' : 'Select gender'"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-sm">{{ locale === 'ua' ? 'Категорія' : 'Category' }}</label>
            <Select
              v-model="formData.category"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="locale === 'ua' ? 'Оберіть категорію' : 'Select category'"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="dob" class="font-semibold text-sm">{{ locale === 'ua' ? 'Дата народження' : 'DOB' }}</label>
            <InputText v-model="formData.dob" id="dob" :placeholder="dobPlaceholder" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label for="team" class="font-semibold text-sm">{{ locale === 'ua' ? 'Команда / Клуб' : 'Team / Club' }}</label>
            <InputText v-model="formData.team" id="team" :placeholder="locale === 'ua' ? 'Команда' : 'Team'" />
          </div>

          <div class="flex flex-col gap-1">
            <label for="address" class="font-semibold text-sm">{{ locale === 'ua' ? 'Місто / Регіон' : 'City' }}</label>
            <InputText v-model="formData.address" id="address" :placeholder="locale === 'ua' ? 'Київ' : 'City'" />
          </div>
        </div>

        <!-- Target Stages Selection -->
        <div class="border-t border-surface-200 dark:border-surface-800 pt-3 mt-1 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="font-semibold text-sm">
              {{ locale === 'ua' ? 'Зареєструвати на етапи:' : 'Register for stages:' }}
            </label>
            <div class="flex items-center gap-2">
              <Checkbox v-model="allStagesSelected" :binary="true" inputId="allStages" />
              <label for="allStages" class="text-xs cursor-pointer select-none">
                {{ locale === 'ua' ? 'Всі етапи' : 'All stages' }}
              </label>
            </div>
          </div>

          <div v-if="!allStagesSelected" class="flex flex-col gap-1.5 max-h-36 overflow-y-auto pl-1">
            <div v-for="stg in stages" :key="stg.id" class="flex items-center gap-2">
              <Checkbox
                v-model="selectedStageIds"
                :value="stg.id"
                :inputId="'stg_' + stg.id"
              />
              <label :for="'stg_' + stg.id" class="text-sm cursor-pointer select-none">
                {{ stg.name || ('Stage ' + stg.number) }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            :label="locale === 'ua' ? 'Скасувати' : 'Cancel'"
            severity="secondary"
            @click="addDialogVisible = false"
          />
          <Button
            type="button"
            :label="locale === 'ua' ? 'Додати' : 'Create'"
            icon="pi pi-check"
            :loading="isSaving"
            @click="saveCompetitor"
          />
        </div>
      </template>
    </Dialog>

    <ConfirmDialog group="competitor-delete" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useCompetitorsStore } from '@/stores/competitors'

const props = defineProps({
  competitionId: {
    type: String,
    required: true,
  },
  competitors: {
    type: Array,
    default: () => [],
  },
  stages: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['competitor-added', 'competitor-deleted'])

const { locale } = useI18n()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const competitorsStore = useCompetitorsStore()

const searchQuery = ref('')
const addDialogVisible = ref(false)
const isSaving = ref(false)
const allStagesSelected = ref(true)
const selectedStageIds = ref([])

const genderOptions = computed(() => [
  { label: locale.value === 'ua' ? 'Чоловік' : 'Male', value: 'Male' },
  { label: locale.value === 'ua' ? 'Жінка' : 'Female', value: 'Female' },
])

const dobPlaceholder = computed(() => {
  return locale.value === 'ua' ? 'dd-mm-yyyy' : 'yyyy-mm-dd'
})

const categoryOptions = computed(() => [
  { label: locale.value === 'ua' ? 'Аматори (Amateurs)' : 'Amateurs', value: 'amateurs' },
  { label: locale.value === 'ua' ? 'Майстри (Masters)' : 'Masters', value: 'masters' },
  { label: locale.value === 'ua' ? 'Еліта (Elite)' : 'Elite', value: 'elite' },
  { label: locale.value === 'ua' ? 'Юніори (Juniors)' : 'Juniors', value: 'juniors' },
])

const formData = reactive({
  name: '',
  secondName: '',
  competitorNumber: null,
  gender: 'Male',
  category: 'amateurs',
  dob: '',
  team: '',
  address: '',
})

const stagesMap = computed(() => {
  const map = {}
  props.stages.forEach((s) => {
    map[s.id] = s
  })
  return map
})

const uniqueCompetitors = computed(() => {
  const map = new Map()

  props.competitors.forEach((c) => {
    const key = c.competitorNumber != null
      ? `num_${c.competitorNumber}`
      : `name_${(c.secondName || '').trim().toLowerCase()}_${(c.name || '').trim().toLowerCase()}`

    if (!map.has(key)) {
      map.set(key, {
        id: c.id,
        primaryRecord: c,
        records: [],
        competitorNumber: c.competitorNumber,
        name: c.name,
        secondName: c.secondName,
        fullName: `${c.secondName || ''} ${c.name || ''}`.trim(),
        gender: c.gender,
        category: c.category,
        team: c.team,
        address: c.address,
        stagesList: [],
      })
    }

    const item = map.get(key)
    item.records.push(c)
    if (c.stageId && stagesMap.value[c.stageId]) {
      const stageInfo = stagesMap.value[c.stageId]
      if (!item.stagesList.some((s) => s.id === stageInfo.id)) {
        item.stagesList.push(stageInfo)
      }
    }
  })

  return Array.from(map.values())
})

const filteredCompetitors = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return uniqueCompetitors.value

  return uniqueCompetitors.value.filter((c) => {
    return (
      (c.fullName && c.fullName.toLowerCase().includes(q)) ||
      (c.competitorNumber != null && String(c.competitorNumber).includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.team && c.team.toLowerCase().includes(q))
    )
  })
})

const openAddDialog = () => {
  if (props.stages.length === 0) {
    toast.add({
      severity: 'warn',
      summary: locale.value === 'ua' ? 'Увага' : 'Warning',
      detail: locale.value === 'ua'
        ? 'Спочатку створіть етап у вкладці «Етапи»'
        : 'Please create a stage in the "Stages" tab first',
      life: 3500,
    })
    return
  }

  formData.name = ''
  formData.secondName = ''
  formData.competitorNumber = null
  formData.gender = 'Male'
  formData.category = 'amateurs'
  formData.dob = ''
  formData.team = ''
  formData.address = ''
  allStagesSelected.value = true
  selectedStageIds.value = props.stages.map((s) => s.id)
  addDialogVisible.value = true
}

watch(allStagesSelected, (val) => {
  if (val) {
    selectedStageIds.value = props.stages.map((s) => s.id)
  }
})

const saveCompetitor = async () => {
  if (!formData.name?.trim() || !formData.secondName?.trim()) {
    toast.add({
      severity: 'error',
      summary: locale.value === 'ua' ? 'Помилка' : 'Error',
      detail: locale.value === 'ua' ? "Вкажіть ім'я та прізвище" : 'First and last name are required',
      life: 3000,
    })
    return
  }

  if (formData.competitorNumber == null) {
    toast.add({
      severity: 'error',
      summary: locale.value === 'ua' ? 'Помилка' : 'Error',
      detail: locale.value === 'ua' ? 'Вкажіть стартовий номер' : 'Competitor number is required',
      life: 3000,
    })
    return
  }

  const targetStages = allStagesSelected.value
    ? props.stages.map((s) => s.id)
    : selectedStageIds.value

  if (targetStages.length === 0) {
    toast.add({
      severity: 'error',
      summary: locale.value === 'ua' ? 'Помилка' : 'Error',
      detail: locale.value === 'ua' ? 'Оберіть хоча б один етап' : 'Select at least one stage',
      life: 3000,
    })
    return
  }

  isSaving.value = true
  try {
    for (const stageId of targetStages) {
      await competitorsStore.addCompetitor({
        competitionId: props.competitionId,
        stageId,
        name: formData.name.trim(),
        secondName: formData.secondName.trim(),
        gender: formData.gender,
        category: formData.category,
        dob: formData.dob?.trim() || '',
        team: formData.team?.trim() || '',
        address: formData.address?.trim() || '',
        competitorNumber: Number(formData.competitorNumber),
      })
    }

    addDialogVisible.value = false
    toast.add({
      severity: 'success',
      summary: locale.value === 'ua' ? 'Успішно' : 'Success',
      detail: locale.value === 'ua'
        ? `Учасника #${formData.competitorNumber} додано до ${targetStages.length} етапів`
        : `Competitor #${formData.competitorNumber} added to ${targetStages.length} stages`,
      life: 3500,
    })
    emit('competitor-added')
  } catch (error) {
    console.error('Failed to add competitor:', error)
    toast.add({
      severity: 'error',
      summary: locale.value === 'ua' ? 'Помилка' : 'Error',
      detail: error.message || 'Failed to add competitor',
      life: 3500,
    })
  } finally {
    isSaving.value = false
  }
}

const goToEditCompetitor = (record) => {
  if (!record?.id || !record?.stageId) return
  router.push({
    name: 'competitor-edit',
    params: {
      id: props.competitionId,
      stageId: record.stageId,
      competitorId: record.id,
    },
  })
}

const confirmDeleteCompetitor = (item) => {
  confirm.require({
    group: 'competitor-delete',
    message: locale.value === 'ua'
      ? `Видалити учасника #${item.competitorNumber} (${item.fullName}) з усіх етапів змагання?`
      : `Delete competitor #${item.competitorNumber} (${item.fullName}) from all stages of this competition?`,
    header: locale.value === 'ua' ? 'Підтвердження видалення' : 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: locale.value === 'ua' ? 'Скасувати' : 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: locale.value === 'ua' ? 'Видалити' : 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      try {
        for (const rec of item.records) {
          await competitorsStore.deleteCompetitor(rec.id)
        }
        toast.add({
          severity: 'info',
          summary: locale.value === 'ua' ? 'Видалено' : 'Deleted',
          detail: locale.value === 'ua' ? 'Учасника видалено зі змагання' : 'Competitor removed from competition',
          life: 3000,
        })
        emit('competitor-deleted')
      } catch (error) {
        console.error('Failed to delete competitor:', error)
        toast.add({
          severity: 'error',
          summary: locale.value === 'ua' ? 'Помилка' : 'Error',
          detail: 'Failed to delete competitor',
          life: 3000,
        })
      }
    },
  })
}
</script>
