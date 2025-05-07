import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '@/js/firebase'

export const useAuthStore = defineStore('authStore', {
  state: () => {
    return {
      user: {}
    }
  },
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user.id = user.uid
          this.user.email = user.email
          // this.router.push('/')
        } else {
          this.user = {}
          this.router.replace('/auth')
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
          this.router.push({ name: 'account' })
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
