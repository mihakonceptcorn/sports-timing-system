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

export const useStagesStore = defineStore('stages', {
  state: () => {
    return {
      stages: []
    }
  },
  actions: {
    async getStages(competitionId) {
      const q = query(
        stagesCollectionRef,
        where('competitionId', '==', competitionId),
        orderBy('number', 'desc')
      );
      const querySnapshot = onSnapshot(q, (querySnapshot) => {
        const stages = []
        querySnapshot.forEach((doc) => {
          let stage = {
            id: doc.id,
            competitionId: doc.data().competitionId,
            number: doc.data().number,
            name: doc.data().name,
          }
          stages.push(stage)
        });
        this.stages = stages
      }, error => {
        console.log('error.message: ', error.message)
      });
    },
    async createStage(competitionId, number, name) {
      const payload = {
        competitionId: competitionId,
        number: number,
        name: name
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
