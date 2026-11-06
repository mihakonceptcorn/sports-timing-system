import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read .env file manually
const envPath = path.resolve(__dirname, '../.env')
const envConfig = {}
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim()
      let val = trimmed.slice(idx + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      envConfig[key] = val
    }
  }
}

const firebaseConfig = {
  apiKey: envConfig.VITE_APP_API_KEY || process.env.VITE_APP_API_KEY,
  authDomain: envConfig.VITE_APP_AUTH_DOMAIN || process.env.VITE_APP_AUTH_DOMAIN,
  projectId: envConfig.VITE_APP_PROJECT_ID || process.env.VITE_APP_PROJECT_ID,
  storageBucket: envConfig.VITE_APP_STORAGE_BUCKET || process.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: envConfig.VITE_APP_MESSAGING_SENDER_ID || process.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: envConfig.VITE_APP_APP_ID || process.env.VITE_APP_APP_ID,
  measurementId: envConfig.VITE_APP_MEASUREMENT_ID || process.env.VITE_APP_MEASUREMENT_ID,
}

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.log(`
Usage:
  node scripts/seedDemo.mjs <email> <password>

Example:
  node scripts/seedDemo.mjs user@example.com MySecretPassword123!
`)
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

console.log(`Signing in as ${email}...`)

try {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  console.log(`Signed in successfully! UID: ${user.uid}`)

  const competitionsRef = collection(db, 'competitions')
  const stagesRef = collection(db, 'stages')
  const competitorsRef = collection(db, 'competitors')

  const now = Date.now()
  const baseTime = now - 3600000

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

  console.log('\nCreating 1: Single Run tournament...')
  const comp1 = await addDoc(competitionsRef, {
    name: '[DEMO] Single Run: Голосіївський DH Cup',
    country: 'Україна',
    city: 'Київ',
    location: 'Голосіївський ліс',
    date: baseTime,
    description: 'Класичний швидкісний заїзд на 1 спробу (Single Run)',
    type: 'single_run',
    runsCount: null,
    stages: 1,
    owner: user.uid,
    isDemo: true,
  })
  const s1 = await addDoc(stagesRef, { competitionId: comp1.id, number: 1, name: 'Заїзд', role: 'run' })
  await addRider(comp1.id, s1.id, { number: 10, name: 'Олександр', secondName: 'Коваль', category: 'elite', team: 'Kyiv DH Team', startTime: baseTime + 10000, finishTime: baseTime + 72450 })
  await addRider(comp1.id, s1.id, { number: 12, name: 'Максим', secondName: 'Шевченко', category: 'elite', team: 'Pro Riders UA', startTime: baseTime + 70000, finishTime: baseTime + 134100 })
  await addRider(comp1.id, s1.id, { number: 15, name: 'Андрій', secondName: 'Бойко', category: 'amateurs', team: 'Wild Forest', startTime: baseTime + 130000, finishTime: baseTime + 198800 })
  await addRider(comp1.id, s1.id, { number: 18, name: 'Дмитро', secondName: 'Ткач', category: 'amateurs', team: 'Solo Rider', startTime: baseTime + 190000, finishTime: null })

  console.log('Creating 2: Best of 2 Runs tournament...')
  const comp2 = await addDoc(competitionsRef, {
    name: '[DEMO] Best of 2: Lviv Mini-DH & Pump',
    country: 'Україна',
    city: 'Львів',
    location: 'Погулянка',
    date: baseTime,
    description: '2 спроби на тій самій трасі, у залік іде мінімальний час',
    type: 'best_of_n',
    runsCount: 2,
    stages: 2,
    owner: user.uid,
    isDemo: true,
  })
  const s2Run1 = await addDoc(stagesRef, { competitionId: comp2.id, number: 1, name: 'Спроба 1', role: 'run' })
  const s2Run2 = await addDoc(stagesRef, { competitionId: comp2.id, number: 2, name: 'Спроба 2', role: 'run' })
  await addRider(comp2.id, s2Run1.id, { number: 21, name: 'Тарас', secondName: 'Мельник', category: 'elite', team: 'Lviv Gravity', startTime: baseTime + 10000, finishTime: baseTime + 69200 })
  await addRider(comp2.id, s2Run2.id, { number: 21, name: 'Тарас', secondName: 'Мельник', category: 'elite', team: 'Lviv Gravity', startTime: baseTime + 100000, finishTime: baseTime + 156800 })
  await addRider(comp2.id, s2Run1.id, { number: 22, name: 'Ярослав', secondName: 'Кравчук', category: 'elite', team: 'Carpathian MTB', startTime: baseTime + 20000, finishTime: baseTime + 77400 })
  await addRider(comp2.id, s2Run2.id, { number: 22, name: 'Ярослав', secondName: 'Кравчук', category: 'elite', team: 'Carpathian MTB', startTime: baseTime + 110000, finishTime: baseTime + 168900 })
  await addRider(comp2.id, s2Run1.id, { number: 25, name: 'Ігор', secondName: 'Сидоренко', category: 'amateurs', team: 'Trail Hunters', startTime: baseTime + 30000, finishTime: baseTime + 91500 })
  await addRider(comp2.id, s2Run2.id, { number: 25, name: 'Ігор', secondName: 'Сидоренко', category: 'amateurs', team: 'Trail Hunters', startTime: baseTime + 120000, finishTime: baseTime + 179100 })
  await addRider(comp2.id, s2Run1.id, { number: 28, name: 'Віталій', secondName: 'Поліщук', category: 'amateurs', team: 'FreeRide Club', startTime: baseTime + 40000, finishTime: baseTime + 105000 })
  await addRider(comp2.id, s2Run2.id, { number: 28, name: 'Віталій', secondName: 'Поліщук', category: 'amateurs', team: 'FreeRide Club', startTime: baseTime + 130000, finishTime: null })

  console.log('Creating 3: Qualifying + Final tournament...')
  const comp3 = await addDoc(competitionsRef, {
    name: '[DEMO] Qual + Final: Pylypets DH Pro',
    country: 'Україна',
    city: 'Пилипець',
    location: 'Байк-парк Пилипець',
    date: baseTime,
    description: 'Двораундовий формат: кваліфікація та фінальний заїзд',
    type: 'qualifying_final',
    runsCount: null,
    stages: 2,
    owner: user.uid,
    isDemo: true,
  })
  const s3Qual = await addDoc(stagesRef, { competitionId: comp3.id, number: 1, name: 'Кваліфікація', role: 'qualifying' })
  const s3Final = await addDoc(stagesRef, { competitionId: comp3.id, number: 2, name: 'Фінал', role: 'final' })
  await addRider(comp3.id, s3Qual.id, { number: 31, name: 'Назар', secondName: 'Романюк', category: 'elite', team: 'Red Bull UA', startTime: baseTime + 10000, finishTime: baseTime + 145300 })
  await addRider(comp3.id, s3Final.id, { number: 31, name: 'Назар', secondName: 'Романюк', category: 'elite', team: 'Red Bull UA', startTime: baseTime + 200000, finishTime: baseTime + 328500 })
  await addRider(comp3.id, s3Qual.id, { number: 32, name: 'Богдан', secondName: 'Мороз', category: 'elite', team: 'Extreme Sports', startTime: baseTime + 20000, finishTime: baseTime + 152100 })
  await addRider(comp3.id, s3Final.id, { number: 32, name: 'Богдан', secondName: 'Мороз', category: 'elite', team: 'Extreme Sports', startTime: baseTime + 210000, finishTime: baseTime + 339800 })
  await addRider(comp3.id, s3Qual.id, { number: 33, name: 'Сергій', secondName: 'Бондар', category: 'elite', team: 'Trail Masters', startTime: baseTime + 30000, finishTime: baseTime + 168400 })
  await addRider(comp3.id, s3Final.id, { number: 33, name: 'Сергій', secondName: 'Бондар', category: 'elite', team: 'Trail Masters', startTime: baseTime + 220000, finishTime: null })
  await addRider(comp3.id, s3Qual.id, { number: 35, name: 'Денис', secondName: 'Грищенко', category: 'amateurs', team: 'Green Team', startTime: baseTime + 40000, finishTime: baseTime + 184700 })

  console.log('Creating 4: Multi-stage / Enduro tournament...')
  const comp4 = await addDoc(competitionsRef, {
    name: '[DEMO] Enduro: Yaremche 3 Stages',
    country: 'Україна',
    city: 'Яремче',
    location: 'Скелі Довбуша',
    date: baseTime,
    description: '3 спецділянки за день із сумуванням часу (Enduro format)',
    type: 'multi_stage',
    runsCount: null,
    stages: 3,
    owner: user.uid,
    isDemo: true,
  })
  const s4SS1 = await addDoc(stagesRef, { competitionId: comp4.id, number: 1, name: 'СУ 1 - Кам\'янистий хребет', role: 'special' })
  const s4SS2 = await addDoc(stagesRef, { competitionId: comp4.id, number: 2, name: 'СУ 2 - Лісовий трейл', role: 'special' })
  const s4SS3 = await addDoc(stagesRef, { competitionId: comp4.id, number: 3, name: 'СУ 3 - Швидкісний спуск', role: 'special' })
  await addRider(comp4.id, s4SS1.id, { number: 41, name: 'Юрій', secondName: 'Коваленко', category: 'elite', team: 'Enduro Racing', startTime: baseTime + 10000, finishTime: baseTime + 115200 })
  await addRider(comp4.id, s4SS2.id, { number: 41, name: 'Юрій', secondName: 'Коваленко', category: 'elite', team: 'Enduro Racing', startTime: baseTime + 150000, finishTime: baseTime + 280500 })
  await addRider(comp4.id, s4SS3.id, { number: 41, name: 'Юрій', secondName: 'Коваленко', category: 'elite', team: 'Enduro Racing', startTime: baseTime + 300000, finishTime: baseTime + 390100 })

  await addRider(comp4.id, s4SS1.id, { number: 42, name: 'Артем', secondName: 'Савчук', category: 'elite', team: 'Carpathians Enduro', startTime: baseTime + 20000, finishTime: baseTime + 128000 })
  await addRider(comp4.id, s4SS2.id, { number: 42, name: 'Артем', secondName: 'Савчук', category: 'elite', team: 'Carpathians Enduro', startTime: baseTime + 160000, finishTime: baseTime + 292300 })
  await addRider(comp4.id, s4SS3.id, { number: 42, name: 'Артем', secondName: 'Савчук', category: 'elite', team: 'Carpathians Enduro', startTime: baseTime + 310000, finishTime: baseTime + 402400 })

  await addRider(comp4.id, s4SS1.id, { number: 44, name: 'Олег', secondName: 'Василенко', category: 'amateurs', team: 'Single Track', startTime: baseTime + 30000, finishTime: baseTime + 145100 })
  await addRider(comp4.id, s4SS2.id, { number: 44, name: 'Олег', secondName: 'Василенко', category: 'amateurs', team: 'Single Track', startTime: baseTime + 170000, finishTime: baseTime + 312000 })
  await addRider(comp4.id, s4SS3.id, { number: 44, name: 'Олег', secondName: 'Василенко', category: 'amateurs', team: 'Single Track', startTime: baseTime + 320000, finishTime: baseTime + 418500 })

  await addRider(comp4.id, s4SS1.id, { number: 46, name: 'Павло', secondName: 'Марчук', category: 'amateurs', team: 'Weekend Warriors', startTime: baseTime + 40000, finishTime: baseTime + 162000 })
  await addRider(comp4.id, s4SS2.id, { number: 46, name: 'Павло', secondName: 'Марчук', category: 'amateurs', team: 'Weekend Warriors', startTime: baseTime + 180000, finishTime: baseTime + 328000 })
  await addRider(comp4.id, s4SS3.id, { number: 46, name: 'Павло', secondName: 'Марчук', category: 'amateurs', team: 'Weekend Warriors', startTime: baseTime + 330000, finishTime: null })

  console.log(`\nAll 4 demo tournaments successfully created!`)
  console.log(`- Single Run ID: ${comp1.id}`)
  console.log(`- Best of 2 ID: ${comp2.id}`)
  console.log(`- Qual + Final ID: ${comp3.id}`)
  console.log(`- Enduro 3 Stages ID: ${comp4.id}`)
  console.log(`\nOpen http://localhost:5173/#/account/competitions to view them!`)
  process.exit(0)
} catch (err) {
  console.error('Error during seeding:', err.message)
  process.exit(1)
}

