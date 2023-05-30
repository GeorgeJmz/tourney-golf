import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import type { IUser } from "../models/User";
import "firebase/database";
import "firebase/storage";
import { ITournament } from "../models/Tournament";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

export const createUser = async (user: IUser): Promise<IUser> => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password || ""
    );
    const firebaseUser = {
      email: user.email,
      id: credentials.user?.uid,
      name: user.name,
      lastName: user.lastName,
    } as IUser;
    await addDoc(collection(db, "users"), firebaseUser);
    return user;
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const login = async (email: string, password: string): Promise<void> => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const { user } = credentials;
    const userCollection = collection(db, "users");
    const userQuery = query(userCollection, where("id", "==", user.uid));
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const getUserByUID = async (uid: string): Promise<IUser | null> => {
  const userCollection = collection(db, "users");
  const userQuery = query(userCollection, where("id", "==", uid));
  const querySnapshot = await getDocs(userQuery);
  let user = null;
  querySnapshot.forEach((doc) => {
    user = doc.data();
  });
  return user;
};

export const createTournament = async (
  tournament: ITournament
): Promise<string> => {
  try {
    const doc = await addDoc(collection(db, "tournament"), tournament);
    return doc.id;
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const updateTournament = async (
  documentId: string,
  updatedData: Partial<ITournament>
): Promise<void> => {
  try {
    const documentRef = doc(db, "tournament", documentId);
    await setDoc(documentRef, updatedData, { merge: true });
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};
