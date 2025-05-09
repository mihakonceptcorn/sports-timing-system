<template>
  <div class="preview-competition w-full">
    <div class="card">
      <div class="flex justify-between mb-6 gap-2 flex-wrap">
        <Button
          @click.prevent="$router.push({name: 'started', params: {id: $route.params.id}})"
          label="Start Competition"
          icon="pi pi-play"
          severity="danger"
        />

        <Button
          @click.prevent="$router.push({name: 'competitions'})"
          label="Go Back"
          icon="pi pi-arrow-left"
        />
      </div>

      <h3 class="text-xl" v-if="competition">{{ competition.name }}</h3>

      <Tabs value="1">
        <TabList>
          <Tab value="0">Competition</Tab>
          <Tab value="1">Competitors</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <Card v-if="competition">
              <template #title>{{ competition.name }}</template>
              <template #content>
                <p>country: <span class="font-bold">{{ competition.country }}</span></p>
                <p>city: <span class="font-bold">{{ competition.city }}</span></p>
                <p>location: <span class="font-bold">{{ competition.location }}</span></p>
                <p>date: <span class="font-bold">{{ competition.date }}</span></p>
                <p>stages: <span class="font-bold">{{ competition.stages }}</span></p>
                <p>description: <span class="font-bold">{{ competition.description }}</span></p>
              </template>
            </Card>
          </TabPanel>
          <TabPanel value="1">
            <Button
              @click.prevent="$router.push({name: 'add-competitor'})"
              label="Add competitor"
              icon="pi pi-user-plus"
              class="mr-6"
            />

            <CompetitorsView />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <div class="mt-6 flex gap-2 flex-wrap">
        <InputText name="email" type="text" placeholder="Email" v-model="email" class="mr-1"/>
        <Button
          @click.prevent="addTimekeeper"
          label="Add Timekeeper"
          icon="pi pi-user-plus"
          severity="warn"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useCompetitorsStore } from '@/stores/competitors.js'
import CompetitorsView from '@/views/competitions/CompetitorsView.vue'

const route = useRoute()
const competitionsStore = useCompetitionsStore()
const competitorsStore = useCompetitorsStore()

const competition = ref(null)
const email = ref('')

onMounted(async () => {
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  await competitorsStore.getCompetitors(route.params.id)
})

const startCompetition = () => {
  console.log('Start');
}

const addTimekeeper = () => {
  competitionsStore.addTimekeeper(route.params.id, email.value)
}

</script>

<style scoped lang="scss">

</style>
