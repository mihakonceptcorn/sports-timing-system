import { defineStore } from 'pinia'
import { collection, onSnapshot, doc, getDoc, getDocs, addDoc, deleteDoc, where, updateDoc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/js/firebase'

const competitorsCollectionRef = collection(db, 'competitors');

export const useCompetitorsStore = defineStore('competitors', {
  state: () => {
    return {
      competitors: [],
      isLoading: false
    }
  },
  actions: {
    async getCompetitors(competitionId) {
      const q = query(competitorsCollectionRef, where('competitionId', '==', competitionId));
      let competitors = []

      const querySnapshot = onSnapshot(q, (querySnapshot) => {
        const competitors = []
        querySnapshot.forEach((doc) => {
          let comp = {
            id: doc.id,
            competitionId: doc.data().competitionId,
            name: doc.data().name,
            secondName: doc.data().secondName,
            gender: doc.data().gender,
            category: doc.data().category,
            dob: doc.data().dob,
            team: doc.data().team,
            country: doc.data().country,
            region: doc.data().region,
            locality: doc.data().locality,
            competitorNumber: doc.data().competitorNumber,
            started: doc.data().started,
          }
          competitors.push(comp)
        });
        this.competitors = competitors
      }, error => {
        console.log('error.message: ', error.message)
      });
    },
    async addCompetitor(competitorData) {
      const payload = {
        competitionId: competitorData.competitionId,
        name: competitorData.name,
        secondName: competitorData.secondName,
        gender: competitorData.gender,
        category: competitorData.category,
        dob: competitorData.dob,
        team: competitorData.team,
        country: competitorData.country,
        region: competitorData.region,
        locality: competitorData.locality,
        competitorNumber: competitorData.competitorNumber,
        started: false
      }

      await addDoc(competitorsCollectionRef, payload)
    },
    async updateStartTime(id, timestamp) {
      await updateDoc(doc(competitorsCollectionRef, id), {
        startTime: timestamp,
        started: true
      });
    },
    async updateFinishTime(id, timestamp) {
      await updateDoc(doc(competitorsCollectionRef, id), {
        finishTime: timestamp
      });
    }
  }
})
