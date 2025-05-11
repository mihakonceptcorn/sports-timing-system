import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '@/js/firebase'
import { useCompetitionsStore } from '@/stores/competitions.js'

export const useAuthStore = defineStore('authStore', {
  state: () => {
    return {
      user: {}
    }
  },
  actions: {
    init() {
      const competitionsStore = useCompetitionsStore()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user.id = user.uid
          this.user.email = user.email
          competitionsStore.init()
          // this.router.push('/')
        } else {
          this.user = {}
          this.router.replace('/')
        }
      });
    },
    registerUser(credentials) {
      createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then((userCredential) => {
          const user = userCredential.user
          this.router.push({ name: 'account' })
        })
        .catch((error) => {
          console.log('error message: ', error.message)
        })
    },
    loginUser(credentials) {
      signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then((userCredential) => {
          const user = userCredential.user
          this.router.push({ name: 'dashboard' })
        })
        .catch((error) => {
          console.log('error message: ', error.message)
        });
    },
    logoutUser() {
      signOut(auth)
        .then(() => {})
        .catch((error) => {
          console.log('error message: ', error.message)
        });
    },
  },
})
