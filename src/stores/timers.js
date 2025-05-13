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
            stageId: doc.data().stageId,
            competitorId: doc.data().competitorId,
            number: doc.data().number
          }
          timers.push(timer)
        });
        this.timers = timers
      }, error => {
        console.log('error.message: ', error.message)
      });
    },
    async createTimer(competitionId, stageId, competitorId, number) {
      const payload = {
        competitionId: competitionId,
        stageId: stageId,
        competitorId: competitorId,
        number: number,
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
