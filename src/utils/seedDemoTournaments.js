import { db } from '@/js/firebase'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { COMPETITION_TYPE } from '@/constants/competitionTypes'

export async function seedDemoTournaments(userId) {
  if (!userId) throw new Error('User ID is required to seed demo tournaments')

  const competitionsRef = collection(db, 'competitions')
  const stagesRef = collection(db, 'stages')
  const competitorsRef = collection(db, 'competitors')

  const now = Date.now()
  const baseTime = now - 3600000 // 1 hour ago
  const createdCompIds = []

  // Helper to add competitor
  const addRider = async (compId, stageId, data) => {
    return addDoc(competitorsRef, {
      competitionId: compId,
      stageId: stageId,
      competitorNumber: data.number,
      name: data.name,
      secondName: data.secondName,
      gender: data.gender || 'Male',
      category: data.category || 'elite',
      team: data.team || '',
      dob: data.dob || '1995-05-15',
      address: data.address || 'Україна',
      started: data.started ?? true,
      startTime: data.startTime ?? null,
      finishTime: data.finishTime ?? null,
    })
  }

  // =========================================================================
  // 1. SINGLE RUN TOURNAMENT
  // =========================================================================
  const comp1Ref = await addDoc(competitionsRef, {
    name: '[DEMO] Single Run: Голосіївський DH Cup',
    country: 'Україна',
    city: 'Київ',
    location: 'Голосіївський ліс',
    date: baseTime,
    description: 'Класичний швидкісний заїзд на 1 спробу (Single Run)',
    type: COMPETITION_TYPE.SINGLE_RUN,
    runsCount: null,
    stages: 1,
    owner: userId,
    isDemo: true,
  })
  createdCompIds.push(comp1Ref.id)

  const stage1Ref = await addDoc(stagesRef, {
    competitionId: comp1Ref.id,
    number: 1,
    name: 'Заїзд',
    role: 'run',
  })

  // Riders for Single Run
  await addRider(comp1Ref.id, stage1Ref.id, {
    number: 10,
    name: 'Олександр',
    secondName: 'Коваль',
    category: 'elite',
    team: 'Kyiv Downhill Team',
    startTime: baseTime + 10000,
    finishTime: baseTime + 10000 + 62450, // 01:02.45 (1st)
  })
  await addRider(comp1Ref.id, stage1Ref.id, {
    number: 12,
    name: 'Максим',
    secondName: 'Шевченко',
    category: 'elite',
    team: 'Pro Riders Ukraine',
    startTime: baseTime + 70000,
    finishTime: baseTime + 70000 + 64100, // 01:04.10 (2nd)
  })
  await addRider(comp1Ref.id, stage1Ref.id, {
    number: 15,
    name: 'Андрій',
    secondName: 'Бойко',
    category: 'amateurs',
    team: 'Wild Forest Club',
    startTime: baseTime + 130000,
    finishTime: baseTime + 130000 + 68800, // 01:08.80 (3rd)
  })
  await addRider(comp1Ref.id, stage1Ref.id, {
    number: 18,
    name: 'Дмитро',
    secondName: 'Ткач',
    category: 'amateurs',
    team: 'Solo Rider',
    startTime: baseTime + 190000,
    finishTime: null, // DNF
  })

  // =========================================================================
  // 2. BEST OF N RUNS TOURNAMENT (2 runs)
  // =========================================================================
  const comp2Ref = await addDoc(competitionsRef, {
    name: '[DEMO] Best of 2: Lviv Mini-DH & Pump',
    country: 'Україна',
    city: 'Львів',
    location: 'Погулянка',
    date: baseTime,
    description: '2 спроби на тій самій трасі, у залік іде мінімальний час',
    type: COMPETITION_TYPE.BEST_OF_N,
    runsCount: 2,
    stages: 2,
    owner: userId,
    isDemo: true,
  })
  createdCompIds.push(comp2Ref.id)

  const s2Run1 = await addDoc(stagesRef, {
    competitionId: comp2Ref.id,
    number: 1,
    name: 'Спроба 1',
    role: 'run',
  })
  const s2Run2 = await addDoc(stagesRef, {
    competitionId: comp2Ref.id,
    number: 2,
    name: 'Спроба 2',
    role: 'run',
  })

  // Riders in Best of 2
  // Taras: Run 1 59.20s, Run 2 56.80s (best 56.80s -> 1st)
  await addRider(comp2Ref.id, s2Run1.id, {
    number: 21,
    name: 'Тарас',
    secondName: 'Мельник',
    category: 'elite',
    team: 'Lviv Gravity',
    startTime: baseTime + 10000,
    finishTime: baseTime + 10000 + 59200,
  })
  await addRider(comp2Ref.id, s2Run2.id, {
    number: 21,
    name: 'Тарас',
    secondName: 'Мельник',
    category: 'elite',
    team: 'Lviv Gravity',
    startTime: baseTime + 100000,
    finishTime: baseTime + 100000 + 56800,
  })

  // Yaroslav: Run 1 57.40s, Run 2 58.90s (best 57.40s -> 2nd)
  await addRider(comp2Ref.id, s2Run1.id, {
    number: 22,
    name: 'Ярослав',
    secondName: 'Кравчук',
    category: 'elite',
    team: 'Carpathian MTB',
    startTime: baseTime + 20000,
    finishTime: baseTime + 20000 + 57400,
  })
  await addRider(comp2Ref.id, s2Run2.id, {
    number: 22,
    name: 'Ярослав',
    secondName: 'Кравчук',
    category: 'elite',
    team: 'Carpathian MTB',
    startTime: baseTime + 110000,
    finishTime: baseTime + 110000 + 58900,
  })

  // Igor: Run 1 61.50s, Run 2 59.10s (best 59.10s -> 3rd)
  await addRider(comp2Ref.id, s2Run1.id, {
    number: 25,
    name: 'Ігор',
    secondName: 'Сидоренко',
    category: 'amateurs',
    team: 'Trail Hunters',
    startTime: baseTime + 30000,
    finishTime: baseTime + 30000 + 61500,
  })
  await addRider(comp2Ref.id, s2Run2.id, {
    number: 25,
    name: 'Ігор',
    secondName: 'Сидоренко',
    category: 'amateurs',
    team: 'Trail Hunters',
    startTime: baseTime + 120000,
    finishTime: baseTime + 120000 + 59100,
  })

  // Vitaliy: Run 1 65.00s, Run 2 DNF (first run counts!)
  await addRider(comp2Ref.id, s2Run1.id, {
    number: 28,
    name: 'Віталій',
    secondName: 'Поліщук',
    category: 'amateurs',
    team: 'FreeRide Club',
    startTime: baseTime + 40000,
    finishTime: baseTime + 40000 + 65000,
  })
  await addRider(comp2Ref.id, s2Run2.id, {
    number: 28,
    name: 'Віталій',
    secondName: 'Поліщук',
    category: 'amateurs',
    team: 'FreeRide Club',
    startTime: baseTime + 130000,
    finishTime: null, // DNF in run 2
  })

  // =========================================================================
  // 3. QUALIFYING + FINAL TOURNAMENT
  // =========================================================================
  const comp3Ref = await addDoc(competitionsRef, {
    name: '[DEMO] Qual + Final: Pylypets DH Pro',
    country: 'Україна',
    city: 'Пилипець',
    location: 'Байк-парк Пилипець',
    date: baseTime,
    description: 'Двораундовий формат: кваліфікація та фінальний заїзд',
    type: COMPETITION_TYPE.QUALIFYING_FINAL,
    runsCount: null,
    stages: 2,
    owner: userId,
    isDemo: true,
  })
  createdCompIds.push(comp3Ref.id)

  const s3Qual = await addDoc(stagesRef, {
    competitionId: comp3Ref.id,
    number: 1,
    name: 'Кваліфікація',
    role: 'qualifying',
  })
  const s3Final = await addDoc(stagesRef, {
    competitionId: comp3Ref.id,
    number: 2,
    name: 'Фінал',
    role: 'final',
  })

  // Nazar: Qual 02:15.30 (2nd in qual), Final 02:08.50 (WINNER OF FINAL -> 1st)
  await addRider(comp3Ref.id, s3Qual.id, {
    number: 31,
    name: 'Назар',
    secondName: 'Романюк',
    category: 'elite',
    team: 'Red Bull UA',
    startTime: baseTime + 10000,
    finishTime: baseTime + 10000 + 135300,
  })
  await addRider(comp3Ref.id, s3Final.id, {
    number: 31,
    name: 'Назар',
    secondName: 'Романюк',
    category: 'elite',
    team: 'Red Bull UA',
    startTime: baseTime + 200000,
    finishTime: baseTime + 200000 + 128500,
  })

  // Bogdan: Qual 02:12.10 (1st in qual), Final 02:09.80 (+01.30 -> 2nd)
  await addRider(comp3Ref.id, s3Qual.id, {
    number: 32,
    name: 'Богдан',
    secondName: 'Мороз',
    category: 'elite',
    team: 'Extreme Sports',
    startTime: baseTime + 20000,
    finishTime: baseTime + 20000 + 132100,
  })
  await addRider(comp3Ref.id, s3Final.id, {
    number: 32,
    name: 'Богдан',
    secondName: 'Мороз',
    category: 'elite',
    team: 'Extreme Sports',
    startTime: baseTime + 210000,
    finishTime: baseTime + 210000 + 129800,
  })

  // Serhii: Qual 02:18.40 (3rd in qual), Final DNF (3rd overall among finalists)
  await addRider(comp3Ref.id, s3Qual.id, {
    number: 33,
    name: 'Сергій',
    secondName: 'Бондар',
    category: 'elite',
    team: 'Trail Masters',
    startTime: baseTime + 30000,
    finishTime: baseTime + 30000 + 138400,
  })
  await addRider(comp3Ref.id, s3Final.id, {
    number: 33,
    name: 'Сергій',
    secondName: 'Бондар',
    category: 'elite',
    team: 'Trail Masters',
    startTime: baseTime + 220000,
    finishTime: null, // DNF in final
  })

  // Denys: Qual 02:24.70 (did not qualify for final, ranked 4th by Qual)
  await addRider(comp3Ref.id, s3Qual.id, {
    number: 35,
    name: 'Денис',
    secondName: 'Грищенко',
    category: 'amateurs',
    team: 'Green Team',
    startTime: baseTime + 40000,
    finishTime: baseTime + 40000 + 144700,
  })

  // =========================================================================
  // 4. MULTI-STAGE / ENDURO TOURNAMENT (3 Special Stages)
  // =========================================================================
  const comp4Ref = await addDoc(competitionsRef, {
    name: '[DEMO] Enduro: Yaremche 3 Stages',
    country: 'Україна',
    city: 'Яремче',
    location: 'Скелі Довбуша',
    date: baseTime,
    description: '3 спецділянки за день із сумуванням часу (Enduro format)',
    type: COMPETITION_TYPE.MULTI_STAGE,
    runsCount: null,
    stages: 3,
    owner: userId,
    isDemo: true,
  })
  createdCompIds.push(comp4Ref.id)

  const s4SS1 = await addDoc(stagesRef, {
    competitionId: comp4Ref.id,
    number: 1,
    name: 'СУ 1 - Кам\'янистий хребет',
    role: 'special',
  })
  const s4SS2 = await addDoc(stagesRef, {
    competitionId: comp4Ref.id,
    number: 2,
    name: 'СУ 2 - Лісовий трейл',
    role: 'special',
  })
  const s4SS3 = await addDoc(stagesRef, {
    competitionId: comp4Ref.id,
    number: 3,
    name: 'СУ 3 - Швидкісний спуск',
    role: 'special',
  })

  // Yurii: SS1 01:45.20, SS2 02:10.50, SS3 01:30.10 -> Total 05:25.80 (1st)
  await addRider(comp4Ref.id, s4SS1.id, {
    number: 41,
    name: 'Юрій',
    secondName: 'Коваленко',
    category: 'elite',
    team: 'Enduro Racing',
    startTime: baseTime + 10000,
    finishTime: baseTime + 10000 + 105200,
  })
  await addRider(comp4Ref.id, s4SS2.id, {
    number: 41,
    name: 'Юрій',
    secondName: 'Коваленко',
    category: 'elite',
    team: 'Enduro Racing',
    startTime: baseTime + 150000,
    finishTime: baseTime + 150000 + 130500,
  })
  await addRider(comp4Ref.id, s4SS3.id, {
    number: 41,
    name: 'Юрій',
    secondName: 'Коваленко',
    category: 'elite',
    team: 'Enduro Racing',
    startTime: baseTime + 300000,
    finishTime: baseTime + 300000 + 90100,
  })

  // Artem: SS1 01:48.00, SS2 02:12.30, SS3 01:32.40 -> Total 05:32.70 (2nd)
  await addRider(comp4Ref.id, s4SS1.id, {
    number: 42,
    name: 'Артем',
    secondName: 'Савчук',
    category: 'elite',
    team: 'Carpathians Enduro',
    startTime: baseTime + 20000,
    finishTime: baseTime + 20000 + 108000,
  })
  await addRider(comp4Ref.id, s4SS2.id, {
    number: 42,
    name: 'Артем',
    secondName: 'Савчук',
    category: 'elite',
    team: 'Carpathians Enduro',
    startTime: baseTime + 160000,
    finishTime: baseTime + 160000 + 132300,
  })
  await addRider(comp4Ref.id, s4SS3.id, {
    number: 42,
    name: 'Артем',
    secondName: 'Савчук',
    category: 'elite',
    team: 'Carpathians Enduro',
    startTime: baseTime + 310000,
    finishTime: baseTime + 310000 + 92400,
  })

  // Oleg: SS1 01:55.10, SS2 02:22.00, SS3 01:38.50 -> Total 05:55.60 (3rd)
  await addRider(comp4Ref.id, s4SS1.id, {
    number: 44,
    name: 'Олег',
    secondName: 'Василенко',
    category: 'amateurs',
    team: 'Single Track',
    startTime: baseTime + 30000,
    finishTime: baseTime + 30000 + 115100,
  })
  await addRider(comp4Ref.id, s4SS2.id, {
    number: 44,
    name: 'Олег',
    secondName: 'Василенко',
    category: 'amateurs',
    team: 'Single Track',
    startTime: baseTime + 170000,
    finishTime: baseTime + 170000 + 142000,
  })
  await addRider(comp4Ref.id, s4SS3.id, {
    number: 44,
    name: 'Олег',
    secondName: 'Василенко',
    category: 'amateurs',
    team: 'Single Track',
    startTime: baseTime + 320000,
    finishTime: baseTime + 320000 + 98500,
  })

  // Pavlo: SS1 02:02.00, SS2 02:28.00, SS3 DNF -> DNF (2/3)
  await addRider(comp4Ref.id, s4SS1.id, {
    number: 46,
    name: 'Павло',
    secondName: 'Марчук',
    category: 'amateurs',
    team: 'Weekend Warriors',
    startTime: baseTime + 40000,
    finishTime: baseTime + 40000 + 122000,
  })
  await addRider(comp4Ref.id, s4SS2.id, {
    number: 46,
    name: 'Павло',
    secondName: 'Марчук',
    category: 'amateurs',
    team: 'Weekend Warriors',
    startTime: baseTime + 180000,
    finishTime: baseTime + 180000 + 148000,
  })
  await addRider(comp4Ref.id, s4SS3.id, {
    number: 46,
    name: 'Павло',
    secondName: 'Марчук',
    category: 'amateurs',
    team: 'Weekend Warriors',
    startTime: baseTime + 330000,
    finishTime: null, // DNF on SS3
  })

  return createdCompIds
}

export async function deleteDemoTournaments(userId) {
  if (!userId) return 0

  const competitionsRef = collection(db, 'competitions')
  const stagesRef = collection(db, 'stages')
  const competitorsRef = collection(db, 'competitors')

  const q = query(competitionsRef, where('owner', '==', userId))
  const snapshot = await getDocs(q)
  let count = 0

  for (const compDoc of snapshot.docs) {
    const data = compDoc.data()
    const isDemo = data.isDemo || data.name?.startsWith('[DEMO]')
    if (isDemo) {
      const compId = compDoc.id

      // Delete competitors
      const compQ = query(competitorsRef, where('competitionId', '==', compId))
      const compSnap = await getDocs(compQ)
      for (const d of compSnap.docs) {
        await deleteDoc(doc(competitorsRef, d.id))
      }

      // Delete stages
      const stagesQ = query(stagesRef, where('competitionId', '==', compId))
      const stagesSnap = await getDocs(stagesQ)
      for (const d of stagesSnap.docs) {
        await deleteDoc(doc(stagesRef, d.id))
      }

      // Delete competition
      await deleteDoc(doc(competitionsRef, compId))
      count++
    }
  }

  return count
}

