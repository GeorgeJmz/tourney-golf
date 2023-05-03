import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import type { IUser } from '../models/User'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID
}

export const firebase = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore()

export const createUser = async (user: IUser): Promise<IUser> => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    )
    user.id = credentials.user?.uid
    await addDoc(collection(db, 'users'), user)
    return user
  } catch (error) {
    console.error(error)
    throw error
  }
}
