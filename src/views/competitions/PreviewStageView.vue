<template>
  <div class="stage-preview-wrapper w-full">
    <!-- Breadcrumbs navigation -->
    <AppBreadcrumb :items="breadcrumbItems" />

    <Card v-if="stage">
      <template #title>
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ stage.name }}</span>
            <Tag
              v-if="stage.role"
              :value="roleLabel(stage.role)"
              severity="info"
              class="text-xs uppercase"
            />
          </div>

          <!-- Quick switcher dropdown for all stages -->
          <div v-if="sortedStages.length > 1" class="flex items-center gap-2">
            <span class="text-xs text-surface-500 dark:text-surface-400 font-medium">
              {{ locale === 'ua' ? 'Етап:' : 'Stage:' }}
            </span>
            <Select
              :modelValue="stage.id"
              @update:modelValue="onSwitchStage"
              :options="sortedStages"
              optionLabel="name"
              optionValue="id"
              size="small"
              class="w-44 sm:w-56"
            />
          </div>
        </div>
      </template>

      <template #content>
        <!-- Top action buttons -->
        <div class="flex justify-between flex-wrap gap-2 mb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <Button
              @click.prevent="$router.push({ name: 'started', params: { id: $route.params.id, stageId: stage.id } })"
              :label="locale === 'ua' ? 'Запустити таймер' : 'Start stage'"
              icon="pi pi-play"
              severity="danger"
            />
            <Button
              @click.prevent="goToResults"
              :label="locale === 'ua' ? 'Переглянути результати' : 'View Results'"
              icon="pi pi-trophy"
              severity="success"
            />
          </div>

          <Button
            @click.prevent="$router.push({ name: 'competition-preview', params: { id: $route.params.id } })"
            :label="locale === 'ua' ? 'До турніру' : 'Back to competition'"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
          />
        </div>

        <!-- Quick Stage Stepper / Next & Previous Navigation -->
        <div
          v-if="sortedStages.length > 1"
          class="flex items-center justify-between bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-800 rounded-lg p-3 my-4 flex-wrap gap-2"
        >
          <div>
            <Button
              v-if="previousStage"
              @click.prevent="goToStage(previousStage.id)"
              :label="locale === 'ua' ? `← ${previousStage.name}` : `← ${previousStage.name}`"
              icon="pi pi-arrow-left"
              size="small"
              severity="secondary"
              text
            />
            <span v-else class="text-xs text-surface-400 dark:text-surface-500 italic pl-2">
              {{ locale === 'ua' ? 'Перший етап' : 'First stage' }}
            </span>
          </div>

          <div class="text-xs text-surface-500 dark:text-surface-400 font-medium">
            {{ locale === 'ua' ? 'Етап' : 'Stage' }} {{ currentStageIndex + 1 }} {{ locale === 'ua' ? 'з' : 'of' }} {{ sortedStages.length }}
          </div>

          <div>
            <Button
              v-if="nextStage"
              @click.prevent="goToStage(nextStage.id)"
              :label="locale === 'ua' ? `${nextStage.name} →` : `${nextStage.name} →`"
              icon="pi pi-arrow-right"
              iconPos="right"
              size="small"
              severity="secondary"
              text
            />
            <span v-else class="text-xs text-surface-400 dark:text-surface-500 italic pr-2">
              {{ locale === 'ua' ? 'Останній етап' : 'Last stage' }}
            </span>
          </div>
        </div>

        <Message v-if="isLastStage" severity="info" :closable="false" class="mt-2 mb-4">
          {{ locale === 'ua'
            ? 'Це останній етап змагання. Після завершення заїздів натисніть «Переглянути результати» для перегляду підсумкової таблиці.'
            : 'This is the final stage. Once runs are completed, click "View Results" to view the final leaderboard.' }}
        </Message>

        <CompetitorsView />

        <div class="flex items-center gap-2 mt-6 flex-wrap">
          <Button
            @click.prevent="visible = true"
            :label="locale === 'ua' ? 'Додати учасника' : 'Add competitor'"
            icon="pi pi-user-plus"
          />
          <Button
            v-if="otherStages.length"
            @click.prevent="openCopyDialog"
            :label="locale === 'ua' ? 'Копіювати учасників з іншого етапу' : 'Copy competitors from another stage'"
            icon="pi pi-copy"
            severity="secondary"
            outlined
          />
        </div>

        <Dialog
          v-model:visible="copyDialogVisible"
          modal
          :header="locale === 'ua' ? 'Копіювати учасників' : 'Copy Competitors'"
          :style="{ width: '25rem' }"
        >
          <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
            {{ locale === 'ua'
              ? 'Оберіть етап, з якого скопіювати список учасників (без часу заїздів) до цього етапу:'
              : 'Select the stage to copy competitor list from (without run times) into this stage:' }}
          </p>
          <div class="flex flex-col gap-1 mb-6">
            <label class="font-semibold text-sm">{{ locale === 'ua' ? 'З етапу:' : 'From stage:' }}</label>
            <Select
              v-model="selectedSourceStageId"
              :options="otherStages"
              optionLabel="name"
              optionValue="id"
              :placeholder="locale === 'ua' ? 'Оберіть етап' : 'Select stage'"
              class="w-full"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button
              type="button"
              :label="locale === 'ua' ? 'Скасувати' : 'Cancel'"
              severity="secondary"
              @click="copyDialogVisible = false"
            />
            <Button
              type="button"
              :label="locale === 'ua' ? 'Скопіювати' : 'Copy'"
              :loading="isCopying"
              @click="confirmCopyCompetitors"
            />
          </div>
        </Dialog>

        <Dialog
          v-model:visible="visible"
          modal
          :header="locale === 'ua' ? 'Додати учасника' : 'Add competitor'"
          :style="{ width: '25rem' }"
        >
          <div class="flex flex-col gap-0.5">
            <label for="name">{{ locale === 'ua' ? "Ім'я" : 'Name' }}</label>
            <InputText v-model="formData.name" id="name" :placeholder="locale === 'ua' ? 'Імʼя' : 'Name'" />
          </div>

          <div class="flex flex-col gap-0.5 mt-2">
            <label for="secondName">{{ locale === 'ua' ? 'Прізвище' : 'Second Name' }}</label>
            <InputText v-model="formData.secondName" id="secondName" :placeholder="locale === 'ua' ? 'Прізвище' : 'Second Name'" />
          </div>

          <div class="flex flex-col gap-0.5 mt-2">
            <label for="gender">{{ locale === 'ua' ? 'Стать' : 'Gender' }}</label>
            <Select
              v-model="formData.gender"
              :options="genders"
              :placeholder="locale === 'ua' ? 'Оберіть стать' : 'Select gender'"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-0.5 mt-2">
            <label for="category">{{ locale === 'ua' ? 'Категорія' : 'Category' }}</label>
            <Select
              v-model="formData.category"
              :options="categories"
              :placeholder="locale === 'ua' ? 'Оберіть категорію' : 'Select category'"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-0.5 mt-2">
            <label for="dob">{{ locale === 'ua' ? 'Дата народження' : 'DOB' }}</label>
            <InputText v-model="formData.dob" id="dob" :placeholder="locale === 'ua' ? 'dd-mm-yyyy' : 'yyyy-mm-dd'" />
          </div>

          <div class="flex flex-col gap-0.5 mt-2">
            <label for="team">{{ locale === 'ua' ? 'Команда' : 'Team' }}</label>
            <InputText v-model="formData.team" id="team" :placeholder="locale === 'ua' ? 'Команда / Клуб' : 'Team / Club'" />
          </div>

          <div class="flex flex-col gap-0.5 mt-2">
            <label for="region">{{ locale === 'ua' ? 'Місто / Регіон' : 'Address' }}</label>
            <InputText v-model="formData.address" id="region" :placeholder="locale === 'ua' ? 'Місто' : 'Address'" />
          </div>

          <div class="flex flex-col gap-0.5 mt-2">
            <label for="competitorNumber">{{ locale === 'ua' ? 'Стартовий номер' : 'Competitor Number' }}</label>
            <InputNumber v-model="formData.competitorNumber" id="competitorNumber" :placeholder="locale === 'ua' ? 'Номер' : 'Number'" />
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <Button type="button" :label="locale === 'ua' ? 'Скасувати' : 'Cancel'" severity="secondary" @click="visible = false"></Button>
            <Button type="button" :label="locale === 'ua' ? 'Створити' : 'Create'" @click="addCompetitor"></Button>
          </div>
        </Dialog>

        <Toast position="bottom-right"/>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useStagesStore } from '@/stores/stages.js'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useCompetitorsStore } from '@/stores/competitors.js'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch, reactive, ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import CompetitorsView from '@/views/competitions/CompetitorsView.vue'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'
import { getRoleLabel } from '@/constants/competitionTypes'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { locale } = useI18n()
const stagesStore = useStagesStore()
const competitionsStore = useCompetitionsStore()
const competitorsStore = useCompetitorsStore()

const stage = ref(null)
const competition = ref(null)
const visible = ref(false)
const copyDialogVisible = ref(false)
const selectedSourceStageId = ref(null)
const isCopying = ref(false)
const categories = ref(['amateurs', 'masters', 'elite', 'juniors'])
const genders = ref(['Male', 'Female'])

const roleLabel = (role) => getRoleLabel(role, locale.value)

const sortedStages = computed(() => {
  return [...stagesStore.stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
})

const currentStageIndex = computed(() => {
  return sortedStages.value.findIndex((s) => s.id === route.params.stageId)
})

const previousStage = computed(() => {
  if (currentStageIndex.value > 0) {
    return sortedStages.value[currentStageIndex.value - 1]
  }
  return null
})

const nextStage = computed(() => {
  if (currentStageIndex.value >= 0 && currentStageIndex.value < sortedStages.value.length - 1) {
    return sortedStages.value[currentStageIndex.value + 1]
  }
  return null
})

const otherStages = computed(() => {
  return stagesStore.stages.filter((s) => s.id !== route.params.stageId)
})

const isLastStage = computed(() => {
  if (sortedStages.value.length === 0) return false
  const last = sortedStages.value[sortedStages.value.length - 1]
  return last.id === route.params.stageId
})

const breadcrumbItems = computed(() => {
  return [
    {
      label: competition.value?.name || (locale.value === 'ua' ? 'Змагання' : 'Competition'),
      to: { name: 'competition-preview', params: { id: route.params.id } },
    },
    {
      label: stage.value?.name || (locale.value === 'ua' ? 'Етап' : 'Stage'),
    },
  ]
})

const formData = reactive({
  competitionId: route.params.id,
  stageId: route.params.stageId,
  name: null,
  secondName: null,
  gender: null,
  category: null,
  dob: null,
  team: null,
  address: null,
  competitorNumber: null,
})

const goToResults = () => {
  router.push({ name: 'competition-results', params: { id: route.params.id } })
}

const goToStage = (targetStageId) => {
  router.push({
    name: 'stage-preview',
    params: { id: route.params.id, stageId: targetStageId },
  })
}

const onSwitchStage = (newStageId) => {
  if (newStageId && newStageId !== route.params.stageId) {
    goToStage(newStageId)
  }
}

const openCopyDialog = () => {
  if (otherStages.value.length) {
    selectedSourceStageId.value = otherStages.value[0].id
    copyDialogVisible.value = true
  }
}

const confirmCopyCompetitors = async () => {
  if (!selectedSourceStageId.value) return
  isCopying.value = true
  try {
    const count = await competitorsStore.copyCompetitorsFromStage(
      selectedSourceStageId.value,
      route.params.stageId,
      route.params.id
    )
    copyDialogVisible.value = false
    toast.add({
      severity: 'success',
      summary: locale.value === 'ua' ? 'Успішно' : 'Success',
      detail: locale.value === 'ua' ? `Скопійовано ${count} учасників` : `Copied ${count} competitors`,
      life: 3000,
    })
  } catch (error) {
    console.error('Error copying competitors:', error)
    toast.add({
      severity: 'error',
      summary: locale.value === 'ua' ? 'Помилка' : 'Error',
      detail: locale.value === 'ua' ? 'Не вдалося скопіювати учасників' : 'Failed to copy competitors',
      life: 3000,
    })
  } finally {
    isCopying.value = false
  }
}

const addCompetitor = async () => {
  await competitorsStore.addCompetitor(formData)

  visible.value = false

  formData.name = null
  formData.secondName = null
  formData.gender = null
  formData.category = null
  formData.dob = null
  formData.team = null
  formData.address = null
  formData.competitorNumber = null
}

const loadStageData = async () => {
  stage.value = await stagesStore.getStageById(route.params.stageId)
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  await stagesStore.getStages(route.params.id)
  await competitorsStore.getCompetitors(route.params.stageId)
  formData.stageId = route.params.stageId
  formData.competitionId = route.params.id
}

onMounted(() => {
  loadStageData()
})

watch(
  () => route.params.stageId,
  (newStageId, oldStageId) => {
    if (newStageId && newStageId !== oldStageId) {
      loadStageData()
    }
  }
)
</script>
