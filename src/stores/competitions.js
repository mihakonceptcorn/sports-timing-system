import { defineStore } from 'pinia'
import { collection, onSnapshot, doc, getDoc, addDoc, deleteDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/js/firebase'
import { useAuthStore } from '@/stores/auth.js'

let competitionsCollectionRef = null
let competitionsCollectionQuery = null
let storeAuth = null
let getCompetitionsSnapshot = null
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
      getCompetitionsSnapshot = onSnapshot(competitionsCollectionQuery, (querySnapshot) => {
        let competitions = []
        querySnapshot.forEach((doc) => {
          let note = {
            id: doc.id,
            name: doc.data().name,
            stages: doc.data().stages,
            date: doc.data().date,
            country: doc.data().country,
            city: doc.data().city,
            location: doc.data().location,
            description: doc.data().description,
          }
          competitions.push(note)
        });
        this.competitions = competitions
      }, error => {
        console.log('error.message: ', error.message)
      });
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

      await addDoc(competitionsCollectionRef, payload)
    },
    async getCompetitionById(id) {
      const docRef = doc(db, 'competitions', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log("No such document!")
      }
    }
  }
})
