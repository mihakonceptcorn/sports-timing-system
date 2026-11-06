<template>
  <div class="flex flex-col gap-0.5 mt-2">
    <label for="competitionType">{{ locale === 'ua' ? 'Тип змагання' : 'Competition type' }}</label>
    <Select
      v-model="type"
      inputId="competitionType"
      :options="options"
      optionLabel="label"
      optionValue="value"
      :placeholder="locale === 'ua' ? 'Оберіть тип змагання' : 'Select competition type'"
      class="w-full"
    >
      <template #option="{ option }">
        <div class="flex flex-col py-1 max-w-md">
          <span class="font-medium">{{ option.label }}</span>
          <span class="text-sm text-surface-500 whitespace-normal">{{ option.description }}</span>
        </div>
      </template>
      <template #value="{ value, placeholder }">
        <span v-if="value">{{ competitionTypeLabel(value, { locale }) }}</span>
        <span v-else>{{ placeholder }}</span>
      </template>
    </Select>
    <small v-if="selected" class="text-surface-500 mt-1">{{ selected.description }}</small>
  </div>

  <div v-if="type === COMPETITION_TYPE.BEST_OF_N" class="flex flex-col gap-0.5 mt-2">
    <label for="runsCount">{{ locale === 'ua' ? 'Кількість заїздів' : 'Number of runs' }}</label>
    <InputNumber v-model="runsCount" inputId="runsCount" :min="2" showButtons />
    <small class="text-surface-500">
      {{ locale === 'ua' ? 'Щонайменше 2 спроби. У залік іде кращий (найменший) час.' : 'At least 2 attempts. The best (lowest) time counts.' }}
    </small>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  COMPETITION_TYPE,
  competitionTypeLabel,
  getCompetitionTypeOptions,
  getCompetitionType,
} from '@/constants/competitionTypes'

const { locale } = useI18n()
const type = defineModel('type')
const runsCount = defineModel('runsCount')

const options = computed(() => getCompetitionTypeOptions(locale.value))
const selected = computed(() => getCompetitionType(type.value, locale.value))

watch(type, (value) => {
  if (value === COMPETITION_TYPE.BEST_OF_N && (!runsCount.value || runsCount.value < 2)) {
    runsCount.value = 2
  }
})
</script>
