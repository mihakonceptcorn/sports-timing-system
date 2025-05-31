import { defineStore } from 'pinia'
import { collection, onSnapshot, doc, getDoc, addDoc, where, deleteDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/js/firebase'
import { useAuthStore } from '@/stores/auth.js'

let competitionsCollectionRef = null
let competitionsCollectionQuery = null
let storeAuth = null
let getCompetitionsSnapshot = null
let getTimekeepingSnapshot = null

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
        querySnapshot.forEach((doc) => {
          let comp = {
            id: doc.id,
            name: doc.data().name,
            stages: doc.data().stages,
            date: doc.data().date,
            country: doc.data().country,
            city: doc.data().city,
            location: doc.data().location,
            description: doc.data().description,
          }
          competitions.push(comp)
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
        country: competitionData.country,
        city: competitionData.city,
        location: competitionData.location,
        description: competitionData.description,
        owner: storeAuth.user.id,
      }

      await addDoc(competitionsCollectionRef, payload)
    },
    async updateCompetition(competitionData) {
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

      await updateDoc(doc(competitionsCollectionRef, competitionData.id), payload);
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
          tkCompetitions.push(note)
        });
        this.timeKeepingCompetitions = tkCompetitions
      }, error => {
        console.log('error.message: ', error.message)
      });
    }
  }
})
