<template>
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

      <div class="gap-2 mt-4">
        <Button label="Update" icon="pi pi-refresh" @click.prevent="update"/>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStagesStore } from '@/stores/stages.js'

const route = useRoute()
const router = useRouter()
const stagesStore = useStagesStore()

const stage = ref(null)

const update = async () => {
  await stagesStore.updateStage(stage.value)
  await router.push({ name: 'competition-preview', params: { id: route.params.id } })
}

onMounted(async () => {
  stage.value = await stagesStore.getStageById(route.params.stageId)
})
</script>

<style scoped lang="scss">

</style>
