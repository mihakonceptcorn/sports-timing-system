<template>
  <Card v-if="competition" class="relative">
    <template #title>Edit Competition</template>
    <template #content>
      <Button
        @click.prevent="$router.push({name: 'competition-preview', params: {id: competition.id}})"
        icon="pi pi-arrow-left"
        rounded
        aria-label="Filter"
        variant="outlined"
        size="small"
        class="absolute! right-6 top-6"
      />

      <div class="flex flex-col gap-0.5 mt-4">
        <label for="id">Id</label>
        <InputText v-model="competition.id" id="id" placeholder="ID" aria-describedby="username-help" disabled/>
      </div>

      <div class="flex flex-col gap-0.5 mt-4">
        <label for="compname">Name</label>
        <InputText v-model="competition.name" id="compname" placeholder="Competition Name" aria-describedby="username-help" />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="date">Date</label>
        <DatePicker placeholder="Date" id="date" v-model="competitionDate"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="country">Country</label>
        <InputText placeholder="Country" id="country" type="text" v-model="competition.country"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="city">City</label>
        <InputText placeholder="City" id="city" type="text" v-model="competition.city"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="location">Location</label>
        <InputText placeholder="Location" id="location" type="text" v-model="competition.location"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="description">Description</label>
        <TextArea placeholder="Description" id="description" type="text" v-model="competition.description"/>
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
import { useCompetitionsStore } from '@/stores/competitions.js'

const route = useRoute()
const router = useRouter()
const competitionsStore = useCompetitionsStore()

const competition = ref(null)
const competitionDate = ref(null)

const update = async () => {
  competition.value.date = competitionDate.value
  await competitionsStore.updateCompetition(competition.value)
  await router.push({name: 'competitions'})
}

onMounted(async () => {
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  competitionDate.value = new Date(competition.value.date)
})
</script>

<style scoped lang="scss">

</style>
