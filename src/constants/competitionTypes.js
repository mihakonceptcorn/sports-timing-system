import i18n from '@/i18n/i18n.js'

export const COMPETITION_TYPE = {
  SINGLE_RUN: 'single_run',
  BEST_OF_N: 'best_of_n',
  QUALIFYING_FINAL: 'qualifying_final',
  MULTI_STAGE: 'multi_stage',
}

export const COMPETITION_TYPES_BY_LOCALE = {
  ua: [
    {
      value: COMPETITION_TYPE.SINGLE_RUN,
      label: 'Single Run (Одна спроба)',
      shortLabel: 'Single Run',
      description: 'Класичний єдиний заїзд.',
      stageHint: 'Один заїзд. Етап створюється разом зі змаганням.',
    },
    {
      value: COMPETITION_TYPE.BEST_OF_N,
      label: 'Best of N Runs (Краща з кількох спроб)',
      shortLabel: 'Best of N',
      description: '2 або більше спроб без кваліфікації, у залік іде мінімальний час.',
      stageHint: 'Кожен етап — ще одна спроба на тій самій трасі. У залік іде мінімальний час.',
    },
    {
      value: COMPETITION_TYPE.QUALIFYING_FINAL,
      label: 'Qualifying + Final (Кваліфікація + Фінал)',
      shortLabel: 'Qualifying + Final',
      description: 'Двораундовий формат із відбором і фінальним заїздом.',
      stageHint: 'Два раунди: кваліфікація та фінал. Обидва створюються автоматично.',
    },
    {
      value: COMPETITION_TYPE.MULTI_STAGE,
      label: 'Multi-stage / Enduro (Мультистейдж / Ендуро)',
      shortLabel: 'Multi-stage / Enduro',
      description: 'Кілька різних спецділянок за день із сумуванням часу.',
      stageHint: 'Додайте кожну спецділянку окремо. Час сумується по етапах.',
    },
  ],
  en: [
    {
      value: COMPETITION_TYPE.SINGLE_RUN,
      label: 'Single Run (One attempt)',
      shortLabel: 'Single Run',
      description: 'Classic single-run format.',
      stageHint: 'One run. The stage is created together with the competition.',
    },
    {
      value: COMPETITION_TYPE.BEST_OF_N,
      label: 'Best of N Runs (Best of multiple attempts)',
      shortLabel: 'Best of N',
      description: '2 or more runs without qualification, the minimum time counts towards standings.',
      stageHint: 'Each stage is another attempt on the same track. The best (minimum) time counts.',
    },
    {
      value: COMPETITION_TYPE.QUALIFYING_FINAL,
      label: 'Qualifying + Final (Qualification + Final)',
      shortLabel: 'Qualifying + Final',
      description: 'Two-round format with a qualification round and a final run.',
      stageHint: 'Two rounds: qualifying and final. Both are created automatically.',
    },
    {
      value: COMPETITION_TYPE.MULTI_STAGE,
      label: 'Multi-stage / Enduro',
      shortLabel: 'Multi-stage / Enduro',
      description: 'Multiple special stages in a day with cumulative time.',
      stageHint: 'Add each special stage separately. Time is accumulated across stages.',
    },
  ],
}

export const competitionTypeOptionsUa = COMPETITION_TYPES_BY_LOCALE.ua
export const competitionTypeOptionsEn = COMPETITION_TYPES_BY_LOCALE.en

export function resolveLocale(locale) {
  if (locale && (locale === 'en' || locale === 'ua')) {
    return locale
  }
  try {
    const current = i18n?.global?.locale?.value
    if (current && (current === 'en' || current === 'ua')) {
      return current
    }
  } catch {
    // ignore
  }
  return 'ua'
}

export function getCompetitionTypeOptions(locale = resolveLocale()) {
  const loc = resolveLocale(locale)
  return COMPETITION_TYPES_BY_LOCALE[loc] || COMPETITION_TYPES_BY_LOCALE.ua
}

/**
 * Proxy array for backward compatibility and reactive integration with PrimeVue
 */
export const competitionTypeOptions = new Proxy([], {
  get(target, prop) {
    const opts = getCompetitionTypeOptions()
    if (prop === 'length') return opts.length
    if (typeof prop === 'string' && !isNaN(prop)) return opts[Number(prop)]
    if (typeof opts[prop] === 'function') return opts[prop].bind(opts)
    if (prop === Symbol.iterator) return opts[Symbol.iterator].bind(opts)
    return opts[prop]
  },
})

export function getCompetitionType(value, locale = resolveLocale()) {
  const options = getCompetitionTypeOptions(locale)
  return options.find((option) => option.value === value) || null
}

export function competitionTypeLabel(value, { short = false, locale = resolveLocale() } = {}) {
  const type = getCompetitionType(value, locale)
  if (!type) return '—'
  return short ? type.shortLabel : type.label
}

export const ROLE_LABELS = {
  ua: {
    run: 'Заїзд',
    qualifying: 'Кваліфікація',
    final: 'Фінал',
    special: 'Спецділянка',
  },
  en: {
    run: 'Run',
    qualifying: 'Qualifying',
    final: 'Final',
    special: 'Special stage',
  },
}

export function getRoleLabel(role, locale = resolveLocale()) {
  const loc = resolveLocale(locale)
  return ROLE_LABELS[loc]?.[role] || ROLE_LABELS.en?.[role] || '—'
}

export const STAGE_LIMIT_MESSAGES = {
  ua: {
    [COMPETITION_TYPE.SINGLE_RUN]: 'Цей формат має лише один заїзд.',
    [COMPETITION_TYPE.QUALIFYING_FINAL]: 'Кваліфікація та фінал уже створені.',
  },
  en: {
    [COMPETITION_TYPE.SINGLE_RUN]: 'This format only has a single run.',
    [COMPETITION_TYPE.QUALIFYING_FINAL]: 'Qualifying and final are already created.',
  },
}

export function getStageLimitMessage(type, locale = resolveLocale()) {
  const loc = resolveLocale(locale)
  return STAGE_LIMIT_MESSAGES[loc]?.[type] || STAGE_LIMIT_MESSAGES.en?.[type] || ''
}

export const CREATE_STAGE_LABELS = {
  ua: {
    [COMPETITION_TYPE.SINGLE_RUN]: 'Створити заїзд',
    [COMPETITION_TYPE.BEST_OF_N]: 'Додати спробу',
    [COMPETITION_TYPE.QUALIFYING_FINAL]: 'Створити раунд',
    [COMPETITION_TYPE.MULTI_STAGE]: 'Створити етап',
  },
  en: {
    [COMPETITION_TYPE.SINGLE_RUN]: 'Create run',
    [COMPETITION_TYPE.BEST_OF_N]: 'Add run',
    [COMPETITION_TYPE.QUALIFYING_FINAL]: 'Create round',
    [COMPETITION_TYPE.MULTI_STAGE]: 'Create stage',
  },
}

export function getCreateStageLabel(type, locale = resolveLocale()) {
  const loc = resolveLocale(locale)
  return CREATE_STAGE_LABELS[loc]?.[type] || CREATE_STAGE_LABELS.en?.[type] || 'Create stage'
}

export function buildInitialStages(type, runsCount, locale = resolveLocale()) {
  const loc = resolveLocale(locale)
  const isEn = loc === 'en'

  if (type === COMPETITION_TYPE.SINGLE_RUN) {
    return [{ number: 1, name: isEn ? 'Run' : 'Заїзд', role: 'run' }]
  }

  if (type === COMPETITION_TYPE.BEST_OF_N) {
    const count = Math.max(2, Number(runsCount) || 2)
    return Array.from({ length: count }, (_, index) => ({
      number: index + 1,
      name: isEn ? `Run ${index + 1}` : `Спроба ${index + 1}`,
      role: 'run',
    }))
  }

  if (type === COMPETITION_TYPE.QUALIFYING_FINAL) {
    return [
      { number: 1, name: isEn ? 'Qualifying' : 'Кваліфікація', role: 'qualifying' },
      { number: 2, name: isEn ? 'Final' : 'Фінал', role: 'final' },
    ]
  }

  return []
}

export function nextBestOfNStage(existingStages, locale = resolveLocale()) {
  const isEn = resolveLocale(locale) === 'en'
  const numbers = existingStages.map((stage) => Number(stage.number) || 0)
  const nextNumber = (numbers.length ? Math.max(...numbers) : 0) + 1
  return {
    number: nextNumber,
    name: isEn ? `Run ${nextNumber}` : `Спроба ${nextNumber}`,
    role: 'run',
  }
}

export function nextFreeStageNumber(existingStages, preferred) {
  const used = new Set(existingStages.map((stage) => Number(stage.number)))
  if (!used.has(preferred)) return preferred
  let number = 1
  while (used.has(number)) number += 1
  return number
}

export function missingQualifyingFinalStages(existingStages, locale = resolveLocale()) {
  const isEn = resolveLocale(locale) === 'en'
  const roles = new Set(existingStages.map((stage) => stage.role))
  const missing = []
  const reserved = [...existingStages]

  if (!roles.has('qualifying')) {
    const stage = {
      number: nextFreeStageNumber(reserved, 1),
      name: isEn ? 'Qualifying' : 'Кваліфікація',
      role: 'qualifying',
    }
    missing.push(stage)
    reserved.push(stage)
  }

  if (!roles.has('final')) {
    missing.push({
      number: nextFreeStageNumber(reserved, 2),
      name: isEn ? 'Final' : 'Фінал',
      role: 'final',
    })
  }

  return missing
}
