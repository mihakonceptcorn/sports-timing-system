import { defineStore } from 'pinia'
import { collection, onSnapshot, doc, addDoc, deleteDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/js/firebase'
import { useAuthStore } from '@/stores/auth.js'

let competitionsCollectionRef = null
let competitionsCollectionQuery = null
let storeAuth = null
export const useCompetitionsStore = defineStore('competitions', {
  state: () => {
    return {
      competitions: [],
      isLoading: false
    }
  },
  actions: {
    init() {
      storeAuth = useAuthStore()

      competitionsCollectionRef = collection(db, 'competitions');
      competitionsCollectionQuery = query(competitionsCollectionRef, orderBy('date', 'desc'));
      this.getCompetitions()
    },
    getCompetitions() {
      console.log('store getCompetitions action')
    },
    async createCompetition(competitionData) {
      const payload = {
        name: competitionData.name,
        date: competitionData.date.getTime(),
        stages: competitionData.stages,
        country: competitionData.country,
        city: competitionData.city,
        location: competitionData.location,
        description: competitionData.description,
        owner: storeAuth.user.id,
      }

      await addDoc(competitionsCollectionRef, payload);
    },
  }
})
