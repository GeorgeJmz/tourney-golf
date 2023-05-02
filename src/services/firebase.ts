import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'API_KEY',
  authDomain: 'PROJECT_ID.firebaseapp.com',
  // The value of `databaseURL` depends on the location of the database
  databaseURL: 'https://DATABASE_NAME.firebaseio.com',
  projectId: 'PROJECT_ID',
  storageBucket: 'PROJECT_ID.appspot.com',
  messagingSenderId: 'SENDER_ID',
  appId: 'APP_ID',
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  measurementId: 'G-MEASUREMENT_ID'
}

firebase.initializeApp(firebaseConfig)

export default firebase
