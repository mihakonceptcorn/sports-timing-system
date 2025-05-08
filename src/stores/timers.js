import { defineStore } from 'pinia'
import { collection, onSnapshot, doc, getDoc, getDocs, addDoc, deleteDoc, where, updateDoc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/js/firebase'

const timersCollectionRef = collection(db, 'timers');

export const useTimersStore = defineStore('timers', {
  state: () => {
    return {
      timers: []
    }
  },
  actions: {
    async getTimers(competitionId) {
      const q = query(
        timersCollectionRef,
        where('competitionId', '==', competitionId),
        where('active', '==', true)
      );
      const querySnapshot = onSnapshot(q, (querySnapshot) => {
        const timers = []
        querySnapshot.forEach((doc) => {
          let timer = {
            id: doc.id,
            competitionId: doc.data().competitionId,
            competitorId: doc.data().competitorId
          }
          timers.push(timer)
        });
        this.timers = timers
      }, error => {
        console.log('error.message: ', error.message)
      });
    },
    async createTimer(competitionId, competitorId) {
      const payload = {
        competitionId: competitionId,
        competitorId: competitorId,
        active: true
      }

      await addDoc(timersCollectionRef, payload)
    },
    async stopTimer(id) {
      await updateDoc(doc(timersCollectionRef, id), {
        active: false
      });
    },
  }
})
