<template>
  <div class="preview-competition w-full">
    <div class="flex justify-end">
      <Button
        @click.prevent="$router.push({name: 'competitions'})"
        label="Go Back"
        icon="pi pi-arrow-left"
        class="mr-6"
      />
    </div>

    <Card v-if="competition">
      <template #title>{{ competition.name }}</template>
      <template #content>
        <p>country: {{ competition.country }}</p>
        <p>city: {{ competition.city }}</p>
        <p>location: {{ competition.location }}</p>
        <p>date: {{ competition.date }}</p>
        <p>stages: {{ competition.stages }}</p>
        <p>description: {{ competition.description }}</p>
      </template>
    </Card>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useCompetitionsStore } from '@/stores/competitions.js';

const route = useRoute()
const competitionsStore = useCompetitionsStore()

const competition = ref(null)

onMounted(async () => {
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
})

</script>

<style scoped lang="scss">

</style>
