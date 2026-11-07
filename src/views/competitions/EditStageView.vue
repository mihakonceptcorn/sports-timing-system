<template>
  <div class="edit-stage w-full">
    <AppBreadcrumb :items="breadcrumbItems" />
    <Card v-if="stage" class="relative">
    <template #title>Edit Stage</template>
    <template #content>
      <Button
        @click.prevent="$router.push({name: 'competition-preview', params: {id: $route.params.id}})"
        icon="pi pi-arrow-left"
        rounded
        aria-label="Filter"
        variant="outlined"
        size="small"
        class="absolute! right-6 top-6"
      />

      <div class="flex flex-col gap-0.5 mt-4">
        <label for="id">Id</label>
        <InputText v-model="stage.id" id="id" placeholder="ID" aria-describedby="username-help" disabled/>
      </div>

      <div class="flex flex-col gap-0.5 mt-4">
        <label for="id">Number</label>
        <InputNumber v-model="stage.number" id="id" placeholder="number" aria-describedby="username-help"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-4">
        <label for="id">Name</label>
        <InputText v-model="stage.name" id="id" placeholder="name" aria-describedby="username-help"/>
      </div>

      <div v-if="stage.role" class="flex flex-col gap-0.5 mt-4">
        <label for="role">Role</label>
        <InputText :modelValue="stage.role" id="role" disabled />
      </div>

      <div class="gap-2 mt-4">
        <Button label="Update" icon="pi pi-refresh" @click.prevent="update"/>
      </div>
    </template>
  </Card>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStagesStore } from '@/stores/stages.js'
import { useCompetitionsStore } from '@/stores/competitions.js'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const stagesStore = useStagesStore()
const competitionsStore = useCompetitionsStore()

const stage = ref(null)
const competition = ref(null)

const breadcrumbItems = computed(() => [
  {
    label: competition.value?.name || (locale.value === 'ua' ? 'Змагання' : 'Competition'),
    to: { name: 'competition-preview', params: { id: route.params.id } },
  },
  {
    label: stage.value?.name || (locale.value === 'ua' ? 'Етап' : 'Stage'),
    to: { name: 'stage-preview', params: { id: route.params.id, stageId: route.params.stageId } },
  },
  {
    label: locale.value === 'ua' ? 'Редагування' : 'Edit',
  },
])

const update = async () => {
  await stagesStore.updateStage(stage.value)
  await router.push({ name: 'competition-preview', params: { id: route.params.id } })
}

onMounted(async () => {
  stage.value = await stagesStore.getStageById(route.params.stageId)
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
})
</script>

<style scoped lang="scss">

</style>
