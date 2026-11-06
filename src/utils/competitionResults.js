import { COMPETITION_TYPE } from '@/constants/competitionTypes'

/**
 * Format duration in milliseconds to MM:SS.ss or H:MM:SS.ss
 * @param {number|null} durationMs
 * @param {object} options
 * @returns {string}
 */
export function formatDuration(durationMs, { showHundredths = true, showHours = 'auto' } = {}) {
  if (durationMs == null || isNaN(durationMs) || durationMs < 0) return '—'
  const hours = Math.floor(durationMs / 3600000)
  const minutes = Math.floor((durationMs % 3600000) / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  const hundredths = Math.floor((durationMs % 1000) / 10)

  const hStr = String(hours)
  const mStr = String(minutes).padStart(2, '0')
  const sStr = String(seconds).padStart(2, '0')
  const cStr = String(hundredths).padStart(2, '0')

  const timePart = showHundredths ? `${mStr}:${sStr}.${cStr}` : `${mStr}:${sStr}`
  if (showHours === 'always' || (showHours === 'auto' && hours > 0)) {
    return `${hStr}:${timePart}`
  }
  return timePart
}

/**
 * Format time gap (diff from leader) in milliseconds (+SS.ss or +MM:SS.ss or +H:MM:SS.ss)
 * @param {number|null} gapMs
 * @returns {string}
 */
export function formatGap(gapMs) {
  if (gapMs == null || isNaN(gapMs) || gapMs < 0) return '—'
  if (gapMs === 0) return '0.00'
  const hours = Math.floor(gapMs / 3600000)
  const minutes = Math.floor((gapMs % 3600000) / 60000)
  const seconds = Math.floor((gapMs % 60000) / 1000)
  const hundredths = Math.floor((gapMs % 1000) / 10)

  const mStr = String(minutes).padStart(2, '0')
  const sStr = String(seconds).padStart(2, '0')
  const cStr = String(hundredths).padStart(2, '0')

  if (hours > 0) {
    return `+${hours}:${mStr}:${sStr}.${cStr}`
  }
  if (minutes > 0) {
    return `+${mStr}:${sStr}.${cStr}`
  }
  return `+${seconds}.${cStr}`
}

/**
 * Normalizes grouping key for a competitor record across stages
 * @param {object} record
 * @returns {string}
 */
export function getCompetitorKey(record) {
  if (record.competitorNumber != null && String(record.competitorNumber).trim() !== '') {
    return `num_${String(record.competitorNumber).trim()}`
  }
  const name = (record.name || '').trim().toLowerCase()
  const secondName = (record.secondName || '').trim().toLowerCase()
  return `name_${name}_${secondName}`
}

/**
 * Build consolidated athlete records with run times per stage
 * @param {Array} competitors Raw competitor documents from all stages
 * @param {Array} stages Stages of the competition
 * @returns {Array} List of consolidated athlete objects
 */
export function buildAthleteRecords(competitors) {
  const map = new Map()

  for (const record of competitors) {
    const key = getCompetitorKey(record)
    if (!map.has(key)) {
      map.set(key, {
        key,
        competitorNumber: record.competitorNumber ?? null,
        name: record.name || '',
        secondName: record.secondName || '',
        fullName: `${record.name || ''} ${record.secondName || ''}`.trim() || '—',
        gender: record.gender || '',
        category: record.category || '',
        team: record.team || '',
        address: record.address || '',
        stageRuns: {},
      })
    }

    const athlete = map.get(key)
    if (!athlete.competitorNumber && record.competitorNumber != null) athlete.competitorNumber = record.competitorNumber
    if (!athlete.name && record.name) athlete.name = record.name
    if (!athlete.secondName && record.secondName) athlete.secondName = record.secondName
    if (!athlete.team && record.team) athlete.team = record.team
    if (!athlete.category && record.category) athlete.category = record.category

    const start = record.startTime ? Number(record.startTime) : null
    const finish = record.finishTime ? Number(record.finishTime) : null
    let duration = null
    let status = 'DNS'

    if (start && finish && finish > start) {
      duration = finish - start
      status = 'FINISHED'
    } else if (start || record.started) {
      status = 'DNF'
    }

    athlete.stageRuns[record.stageId] = {
      recordId: record.id,
      stageId: record.stageId,
      startTime: start,
      finishTime: finish,
      duration,
      formattedTime: formatDuration(duration),
      status,
    }
  }

  return Array.from(map.values())
}

/**
 * Calculate Single Run results
 */
export function calculateSingleRunResults(athletes, stage) {
  const stageId = stage?.id
  const rows = athletes.map((athlete) => {
    const run = stageId ? athlete.stageRuns[stageId] : null
    const duration = run?.duration ?? null
    const status = run?.status ?? 'DNS'
    return {
      ...athlete,
      duration,
      resultTime: formatDuration(duration),
      status,
      gap: null,
      gapFormatted: '—',
      place: null,
    }
  })

  const finished = rows.filter((r) => r.status === 'FINISHED')
  finished.sort((a, b) => a.duration - b.duration)

  const leaderTime = finished[0]?.duration ?? null
  finished.forEach((row, idx) => {
    row.place = idx + 1
    const gap = row.duration - leaderTime
    row.gap = gap
    row.gapFormatted = formatGap(gap)
  })

  const nonFinished = rows.filter((r) => r.status !== 'FINISHED')
  nonFinished.sort((a, b) => {
    if (a.status === 'DNF' && b.status === 'DNS') return -1
    if (a.status === 'DNS' && b.status === 'DNF') return 1
    return 0
  })

  return [...finished, ...nonFinished]
}

/**
 * Calculate Best of N Runs results
 * The fastest single run time across all N runs is counted
 */
export function calculateBestOfNResults(athletes, stages) {
  const stageList = [...stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
  const stageIds = stageList.map((s) => s.id)

  const rows = athletes.map((athlete) => {
    const runs = stageIds.map((sId) => athlete.stageRuns[sId] || { stageId: sId, duration: null, status: 'DNS', formattedTime: '—' })
    const finishedRuns = runs.filter((r) => r.status === 'FINISHED')

    let bestDuration = null
    let bestStageId = null
    let status = 'DNS'

    if (finishedRuns.length > 0) {
      bestDuration = Math.min(...finishedRuns.map((r) => r.duration))
      bestStageId = finishedRuns.find((r) => r.duration === bestDuration)?.stageId || null
      status = 'FINISHED'
    } else if (runs.some((r) => r.status === 'DNF')) {
      status = 'DNF'
    }

    const allDurationsSorted = finishedRuns.map((r) => r.duration).sort((a, b) => a - b)

    return {
      ...athlete,
      runs,
      bestDuration,
      bestStageId,
      allDurationsSorted,
      resultTime: formatDuration(bestDuration),
      status,
      gap: null,
      gapFormatted: '—',
      place: null,
    }
  })

  const finished = rows.filter((r) => r.status === 'FINISHED')
  finished.sort((a, b) => {
    if (a.bestDuration !== b.bestDuration) {
      return a.bestDuration - b.bestDuration
    }
    // Tie breaker: compare 2nd best, 3rd best, etc.
    const maxLen = Math.max(a.allDurationsSorted.length, b.allDurationsSorted.length)
    for (let i = 1; i < maxLen; i++) {
      const aVal = a.allDurationsSorted[i] ?? Infinity
      const bVal = b.allDurationsSorted[i] ?? Infinity
      if (aVal !== bVal) return aVal - bVal
    }
    return 0
  })

  const leaderTime = finished[0]?.bestDuration ?? null
  finished.forEach((row, idx) => {
    row.place = idx + 1
    const gap = row.bestDuration - leaderTime
    row.gap = gap
    row.gapFormatted = formatGap(gap)
  })

  const nonFinished = rows.filter((r) => r.status !== 'FINISHED')
  nonFinished.sort((a, b) => {
    if (a.status === 'DNF' && b.status === 'DNS') return -1
    if (a.status === 'DNS' && b.status === 'DNF') return 1
    return 0
  })

  return [...finished, ...nonFinished]
}

/**
 * Calculate Qualifying + Final results
 * Finalists ranked by Final time; non-finalists ranked by Qualifying time
 */
export function calculateQualifyingFinalResults(athletes, stages, { mode = 'overall' } = {}) {
  const sortedStages = [...stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
  const qualStage = sortedStages.find((s) => s.role === 'qualifying') || sortedStages[0]
  const finalStage = sortedStages.find((s) => s.role === 'final') || sortedStages[1]

  const rows = athletes.map((athlete) => {
    const qRun = qualStage ? athlete.stageRuns[qualStage.id] : null
    const fRun = finalStage ? athlete.stageRuns[finalStage.id] : null

    const qDuration = qRun?.duration ?? null
    const fDuration = fRun?.duration ?? null
    const qStatus = qRun?.status ?? 'DNS'
    const fStatus = fRun?.status ?? 'DNS'

    let tier = 5
    let status = 'DNS'
    let resultDuration = null
    let note = ''

    if (fStatus === 'FINISHED') {
      tier = 1 // Final finisher
      status = 'FINISHED'
      resultDuration = fDuration
      note = 'Final'
    } else if (fStatus === 'DNF') {
      tier = 2 // DNF in final
      status = 'DNF (Final)'
      resultDuration = null
      note = 'DNF Final'
    } else if (qStatus === 'FINISHED') {
      tier = 3 // Qualifying only
      status = 'FINISHED (Qual)'
      resultDuration = qDuration
      note = 'Qualifying only'
    } else if (qStatus === 'DNF') {
      tier = 4 // DNF in qual
      status = 'DNF (Qual)'
      resultDuration = null
      note = 'DNF Qual'
    }

    return {
      ...athlete,
      qRun,
      fRun,
      qDuration,
      fDuration,
      qFormatted: formatDuration(qDuration),
      fFormatted: formatDuration(fDuration),
      qStatus,
      fStatus,
      tier,
      status,
      resultDuration,
      resultTime: formatDuration(resultDuration),
      note,
      gap: null,
      gapFormatted: '—',
      place: null,
    }
  })

  if (mode === 'qualifying') {
    const finishedQ = rows.filter((r) => r.qStatus === 'FINISHED').sort((a, b) => a.qDuration - b.qDuration)
    const leaderQ = finishedQ[0]?.qDuration ?? null
    finishedQ.forEach((r, idx) => {
      r.place = idx + 1
      const gap = r.qDuration - leaderQ
      r.gap = gap
      r.gapFormatted = formatGap(gap)
      r.resultTime = r.qFormatted
    })
    const rest = rows.filter((r) => r.qStatus !== 'FINISHED')
    return [...finishedQ, ...rest]
  }

  if (mode === 'final') {
    const finishedF = rows.filter((r) => r.fStatus === 'FINISHED').sort((a, b) => a.fDuration - b.fDuration)
    const leaderF = finishedF[0]?.fDuration ?? null
    finishedF.forEach((r, idx) => {
      r.place = idx + 1
      const gap = r.fDuration - leaderF
      r.gap = gap
      r.gapFormatted = formatGap(gap)
      r.resultTime = r.fFormatted
    })
    const rest = rows.filter((r) => r.fStatus !== 'FINISHED')
    return [...finishedF, ...rest]
  }

  // Default: overall combined
  const tier1 = rows.filter((r) => r.tier === 1).sort((a, b) => a.fDuration - b.fDuration)
  const tier2 = rows.filter((r) => r.tier === 2).sort((a, b) => (a.qDuration || Infinity) - (b.qDuration || Infinity))
  const tier3 = rows.filter((r) => r.tier === 3).sort((a, b) => a.qDuration - b.qDuration)
  const tier4 = rows.filter((r) => r.tier === 4)
  const tier5 = rows.filter((r) => r.tier === 5)

  const ranked = [...tier1, ...tier2, ...tier3]
  const finalLeader = tier1[0]?.fDuration ?? null

  ranked.forEach((row, idx) => {
    row.place = idx + 1
    if (row.tier === 1 && finalLeader != null) {
      const gap = row.fDuration - finalLeader
      row.gap = gap
      row.gapFormatted = formatGap(gap)
    } else {
      row.gapFormatted = '—'
    }
  })

  return [...ranked, ...tier4, ...tier5]
}

/**
 * Calculate Multi-stage / Enduro results
 * Sum of all completed special stages. Full finishers ranked first, then partial finishers.
 */
export function calculateMultiStageResults(athletes, stages) {
  const stageList = [...stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
  const stageIds = stageList.map((s) => s.id)
  const totalStages = stageList.length

  const rows = athletes.map((athlete) => {
    const runs = stageIds.map((sId) => athlete.stageRuns[sId] || { stageId: sId, duration: null, status: 'DNS', formattedTime: '—' })
    const finishedRuns = runs.filter((r) => r.status === 'FINISHED')
    const finishedCount = finishedRuns.length
    const totalDuration = finishedCount > 0 ? finishedRuns.reduce((sum, r) => sum + r.duration, 0) : null
    const isFullFinish = totalStages > 0 && finishedCount === totalStages

    let status = 'DNS'
    if (isFullFinish) {
      status = 'FINISHED'
    } else if (finishedCount > 0 || runs.some((r) => r.status === 'DNF')) {
      status = `DNF (${finishedCount}/${totalStages})`
    }

    return {
      ...athlete,
      runs,
      finishedCount,
      totalStages,
      isFullFinish,
      totalDuration,
      resultTime: isFullFinish ? formatDuration(totalDuration) : '—',
      status,
      gap: null,
      gapFormatted: '—',
      place: null,
    }
  })

  const fullFinishers = rows.filter((r) => r.isFullFinish).sort((a, b) => a.totalDuration - b.totalDuration)
  const leaderTotal = fullFinishers[0]?.totalDuration ?? null

  fullFinishers.forEach((row, idx) => {
    row.place = idx + 1
    const gap = row.totalDuration - leaderTotal
    row.gap = gap
    row.gapFormatted = formatGap(gap)
  })

  const partialFinishers = rows
    .filter((r) => !r.isFullFinish && r.finishedCount > 0)
    .sort((a, b) => {
      if (b.finishedCount !== a.finishedCount) return b.finishedCount - a.finishedCount
      return (a.totalDuration || Infinity) - (b.totalDuration || Infinity)
    })

  const dns = rows.filter((r) => !r.isFullFinish && r.finishedCount === 0)

  return [...fullFinishers, ...partialFinishers, ...dns]
}

/**
 * Universal competition results calculator
 */
export function calculateCompetitionResults({ competition, stages = [], competitors = [], options = {} }) {
  const sortedStages = [...stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
  const athletes = buildAthleteRecords(competitors, sortedStages)
  const compType = competition?.type || COMPETITION_TYPE.MULTI_STAGE

  let results = []

  switch (compType) {
    case COMPETITION_TYPE.SINGLE_RUN:
      results = calculateSingleRunResults(athletes, sortedStages[0])
      break

    case COMPETITION_TYPE.BEST_OF_N:
      results = calculateBestOfNResults(athletes, sortedStages)
      break

    case COMPETITION_TYPE.QUALIFYING_FINAL:
      results = calculateQualifyingFinalResults(athletes, sortedStages, { mode: options.qfMode || 'overall' })
      break

    case COMPETITION_TYPE.MULTI_STAGE:
    default:
      results = calculateMultiStageResults(athletes, sortedStages)
      break
  }

  // Filter by category if specified and re-rank within category
  if (options.category && options.category !== 'all') {
    const filtered = results.filter((r) => (r.category || '').toLowerCase() === options.category.toLowerCase())
    // Re-assign category places and gaps
    const finished = filtered.filter((r) => r.place != null)
    let catLeaderTime = null
    if (compType === COMPETITION_TYPE.MULTI_STAGE) {
      catLeaderTime = finished[0]?.totalDuration ?? null
    } else if (compType === COMPETITION_TYPE.BEST_OF_N) {
      catLeaderTime = finished[0]?.bestDuration ?? null
    } else if (compType === COMPETITION_TYPE.QUALIFYING_FINAL) {
      catLeaderTime = finished[0]?.fDuration || finished[0]?.qDuration || null
    } else {
      catLeaderTime = finished[0]?.duration ?? null
    }

    finished.forEach((row, idx) => {
      row.categoryPlace = idx + 1
      if (catLeaderTime != null) {
        const time = row.totalDuration || row.bestDuration || row.fDuration || row.duration || null
        if (time != null) {
          const gap = time - catLeaderTime
          row.categoryGapFormatted = formatGap(gap)
        }
      }
    })

    return filtered
  }

  return results
}
