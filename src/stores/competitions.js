import { defineStore } from 'pinia'
import { collection, onSnapshot, doc, getDoc, addDoc, where, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '@/js/firebase'
import { useAuthStore } from '@/stores/auth.js'
import { useStagesStore } from '@/stores/stages.js'
import { COMPETITION_TYPE, buildInitialStages } from '@/constants/competitionTypes'

let competitionsCollectionRef = null
let competitionsCollectionQuery = null
let storeAuth = null
let getCompetitionsSnapshot = null
let getTimekeepingSnapshot = null

function mapCompetition(docSnap) {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    name: data.name,
    stages: data.stages,
    date: data.date,
    country: data.country,
    city: data.city,
    location: data.location,
    description: data.description,
    type: data.type || null,
    runsCount: data.runsCount ?? null,
    timekeeper: data.timekeeper || null,
  }
}

function competitionFields(competitionData) {
  const type = competitionData.type || null
  const runsCount = type === COMPETITION_TYPE.BEST_OF_N
    ? Math.max(2, Number(competitionData.runsCount) || 2)
    : null

  return {
    name: competitionData.name,
    date: competitionData.date instanceof Date ? competitionData.date.getTime() : competitionData.date,
    country: competitionData.country,
    city: competitionData.city,
    location: competitionData.location,
    description: competitionData.description,
    type,
    runsCount,
  }
}

export const useCompetitionsStore = defineStore('competitions', {
  state: () => {
    return {
      competitions: [],
      timeKeepingCompetitions: [],
      isLoading: false
    }
  },
  actions: {
    init() {
      storeAuth = useAuthStore()

      competitionsCollectionRef = collection(db, 'competitions');
      competitionsCollectionQuery = query(
        competitionsCollectionRef,
        where('owner', '==', storeAuth.user.id),
        orderBy('date', 'desc')
      );
      this.getCompetitions()
      this.getTimekeepingCompetitions()
    },
    getCompetitions() {
      getCompetitionsSnapshot = onSnapshot(competitionsCollectionQuery, (querySnapshot) => {
        let competitions = []
        querySnapshot.forEach((docSnap) => {
          competitions.push(mapCompetition(docSnap))
        });
        this.competitions = competitions
      }, error => {
        console.log('error.message: ', error.message)
      });
    },
    async createCompetition(competitionData) {
      const fields = competitionFields(competitionData)
      const docRef = await addDoc(competitionsCollectionRef, {
        ...fields,
        owner: storeAuth.user.id,
      })

      const stagesStore = useStagesStore()
      const stages = buildInitialStages(fields.type, fields.runsCount)
      for (const stage of stages) {
        await stagesStore.createStage(docRef.id, stage.number, stage.name, stage.role)
      }

      return docRef.id
    },
    async updateCompetition(competitionData) {
      const payload = {
        ...competitionFields(competitionData),
        stages: competitionData.stages,
        owner: storeAuth.user.id,
      }

      await updateDoc(doc(competitionsCollectionRef, competitionData.id), payload);
    },
    async updateRunsCount(id, runsCount) {
      await updateDoc(doc(competitionsCollectionRef, id), {
        runsCount: Math.max(2, Number(runsCount) || 2),
      })
    },
    async deleteCompetition(id) {
      await deleteDoc(doc(competitionsCollectionRef, id));
    },
    async getCompetitionById(id) {
      const docRef = doc(db, 'competitions', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const competition = docSnap.data()
        competition.id = docSnap.id
        return competition
      } else {
        console.log("No such document!")
      }
    },
    async addTimekeeper(competitionId, email) {
      await updateDoc(doc(competitionsCollectionRef, competitionId), {
        timekeeper: email
      });
    },
    async removeTimekeeper(competitionId) {
      await updateDoc(doc(competitionsCollectionRef, competitionId), {
        timekeeper: null
      });
    },
    getTimekeepingCompetitions() {
      const timekeepingCollectionQuery = query(
        competitionsCollectionRef,
        where('timekeeper', '==', storeAuth.user.email)
      );

      getTimekeepingSnapshot = onSnapshot(timekeepingCollectionQuery, (querySnapshot) => {
        let tkCompetitions = []
        querySnapshot.forEach((docSnap) => {
          tkCompetitions.push(mapCompetition(docSnap))
        });
        this.timeKeepingCompetitions = tkCompetitions
      }, error => {
        console.log('error.message: ', error.message)
      });
    }
  }
})
