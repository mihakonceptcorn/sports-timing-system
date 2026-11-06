import { defineStore } from 'pinia'
import { collection, onSnapshot, doc, getDoc, getDocs, addDoc, deleteDoc, where, updateDoc, query } from 'firebase/firestore'
import { db } from '@/js/firebase'

const competitorsCollectionRef = collection(db, 'competitors');

let competitionCompetitorsUnsubscribes = []

export const useCompetitorsStore = defineStore('competitors', {
  state: () => {
    return {
      competitors: [],
      competitionCompetitors: [],
      isLoading: false
    }
  },
  actions: {
    async getCompetitors(stageId) {
      const q = query(competitorsCollectionRef, where('stageId', '==', stageId));

      onSnapshot(q, (snapshot) => {
        const competitors = []
        snapshot.forEach((doc) => {
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
            startTime: doc.data().startTime,
            finishTime: doc.data().finishTime,
          }
          competitors.push(comp)
        });
        this.competitors = competitors
      }, error => {
        console.log('error.message: ', error.message)
      });
    },
    subscribeToCompetitionCompetitors(stageIds, callback) {
      // Clean up previous subscriptions
      competitionCompetitorsUnsubscribes.forEach((unsub) => unsub())
      competitionCompetitorsUnsubscribes = []

      if (!stageIds || stageIds.length === 0) {
        this.competitionCompetitors = []
        if (callback) callback([])
        return () => {}
      }

      const stageDataMap = {}

      stageIds.forEach((stageId) => {
        const q = query(competitorsCollectionRef, where('stageId', '==', stageId))
        const unsub = onSnapshot(
          q,
          (querySnapshot) => {
            const list = []
            querySnapshot.forEach((docSnap) => {
              const d = docSnap.data()
              list.push({
                id: docSnap.id,
                stageId: d.stageId,
                competitionId: d.competitionId || null,
                name: d.name || '',
                secondName: d.secondName || '',
                gender: d.gender || '',
                category: d.category || '',
                dob: d.dob || '',
                team: d.team || '',
                address: d.address || '',
                competitorNumber: d.competitorNumber ?? null,
                started: Boolean(d.started),
                startTime: d.startTime ?? null,
                finishTime: d.finishTime ?? null,
              })
            })
            stageDataMap[stageId] = list

            const combined = Object.values(stageDataMap).flat()
            this.competitionCompetitors = combined
            if (callback) callback(combined)
          },
          (error) => {
            console.error('Error fetching competition competitors for stage:', stageId, error)
          }
        )
        competitionCompetitorsUnsubscribes.push(unsub)
      })

      return () => {
        competitionCompetitorsUnsubscribes.forEach((unsub) => unsub())
        competitionCompetitorsUnsubscribes = []
      }
    },
    async getCompetitionCompetitors(stageIds) {
      if (!stageIds || stageIds.length === 0) return []
      const results = []
      for (const stageId of stageIds) {
        const q = query(competitorsCollectionRef, where('stageId', '==', stageId))
        const snapshot = await getDocs(q)
        snapshot.forEach((docSnap) => {
          const d = docSnap.data()
          results.push({
            id: docSnap.id,
            stageId: d.stageId,
            competitionId: d.competitionId || null,
            name: d.name || '',
            secondName: d.secondName || '',
            gender: d.gender || '',
            category: d.category || '',
            dob: d.dob || '',
            team: d.team || '',
            address: d.address || '',
            competitorNumber: d.competitorNumber ?? null,
            started: Boolean(d.started),
            startTime: d.startTime ?? null,
            finishTime: d.finishTime ?? null,
          })
        })
      }
      this.competitionCompetitors = results
      return results
    },
    async copyCompetitorsFromStage(sourceStageId, targetStageId, competitionId = null) {
      if (!sourceStageId || !targetStageId) return 0
      const q = query(competitorsCollectionRef, where('stageId', '==', sourceStageId))
      const snapshot = await getDocs(q)
      let count = 0
      for (const docSnap of snapshot.docs) {
        const d = docSnap.data()
        await addDoc(competitorsCollectionRef, {
          competitionId: competitionId || d.competitionId || null,
          stageId: targetStageId,
          name: d.name || '',
          secondName: d.secondName || '',
          gender: d.gender || null,
          category: d.category || null,
          dob: d.dob || null,
          team: d.team || null,
          address: d.address || null,
          competitorNumber: d.competitorNumber ?? null,
          started: false,
          startTime: null,
          finishTime: null,
        })
        count++
      }
      return count
    },
    async getCompetitorById(id) {
      const docRef = doc(db, 'competitors', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const competitor = docSnap.data()
        competitor.id = docSnap.id
        return competitor
      } else {
        console.log("No such document!")
      }
    },
    async addCompetitor(competitorData) {
      const payload = {
        competitionId: competitorData.competitionId || null,
        stageId: competitorData.stageId,
        name: competitorData.name,
        secondName: competitorData.secondName,
        gender: competitorData.gender,
        category: competitorData.category,
        dob: competitorData.dob,
        team: competitorData.team,
        address: competitorData.address,
        competitorNumber: competitorData.competitorNumber,
        started: false
      }

      await addDoc(competitorsCollectionRef, payload)
    },
    async updateCompetitor(competitorData) {
      const payload = {
        name: competitorData.name,
        secondName: competitorData.secondName,
        gender: competitorData.gender,
        category: competitorData.category,
        dob: competitorData.dob,
        team: competitorData.team,
        address: competitorData.address,
        competitorNumber: competitorData.competitorNumber
      }

      await updateDoc(doc(competitorsCollectionRef, competitorData.id), payload);
    },
    async deleteCompetitor(id) {
      await deleteDoc(doc(competitorsCollectionRef, id));
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
