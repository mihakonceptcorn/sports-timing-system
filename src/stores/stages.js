import { defineStore } from 'pinia'
import {
  collection,
  onSnapshot,
  addDoc,
  where,
  query,
  orderBy,
  doc,
  getDoc, deleteDoc, updateDoc
} from 'firebase/firestore';
import { db } from '@/js/firebase'

const stagesCollectionRef = collection(db, 'stages');
let stagesUnsubscribe = null;

export const useStagesStore = defineStore('stages', {
  state: () => {
    return {
      stages: []
    }
  },
  actions: {
    clearStages() {
      if (stagesUnsubscribe) {
        stagesUnsubscribe()
        stagesUnsubscribe = null
      }
      this.stages = []
    },
    async getStages(competitionId) {
      this.clearStages()

      if (!competitionId) return

      const q = query(
        stagesCollectionRef,
        where('competitionId', '==', competitionId),
        orderBy('number', 'desc')
      );
      stagesUnsubscribe = onSnapshot(q, (querySnapshot) => {
        const stages = []
        querySnapshot.forEach((docSnap) => {
          let stage = {
            id: docSnap.id,
            competitionId: docSnap.data().competitionId,
            number: docSnap.data().number,
            name: docSnap.data().name,
            role: docSnap.data().role || null,
          }
          stages.push(stage)
        });
        this.stages = stages
      }, error => {
        console.log('error.message: ', error.message)
      });
    },
    async createStage(competitionId, number, name, role = null) {
      const payload = {
        competitionId: competitionId,
        number: number,
        name: name,
        role: role,
      }

      await addDoc(stagesCollectionRef, payload)
    },
    async updateStage(stageData) {
      const payload = {
        name: stageData.name,
        number: stageData.number
      }

      await updateDoc(doc(stagesCollectionRef, stageData.id), payload);
    },
    async deleteStage(id) {
      await deleteDoc(doc(stagesCollectionRef, id));
    },
    async getStageById(id) {
      const docRef = doc(db, 'stages', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const stage = docSnap.data()
        stage.id = docSnap.id
        return stage
      } else {
        console.log("No such document!")
      }
    }
  }
})
