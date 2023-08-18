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
import { IMatch } from "../models/Match";
import { IScore } from "../models/Score";

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

//create a function that returns a lists of users that could match with the letters that the user is typing
export const getUsersByName = async (
  name: string
): Promise<Array<IUser> | null> => {
  const userCollection = collection(db, "users");
  const userQuery = query(userCollection, where("name", "==", name));
  const querySnapshot = await getDocs(userQuery);
  const users: Array<IUser> = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data() as unknown as IUser);
  });
  return users;
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

export const getTournamentsByID = async (
  id: string
): Promise<Array<ITournament> | null> => {
  const tournamentCollection = collection(db, "tournament");
  const userQuery = query(tournamentCollection, where("author", "==", id));
  const querySnapshot = await getDocs(userQuery);
  const tournaments = [] as Array<ITournament>;
  querySnapshot.forEach((doc) => {
    tournaments.push(doc.data() as unknown as ITournament);
  });
  return tournaments as Array<ITournament>;
};

export const getMatchesByID = async (
  id: string
): Promise<Array<IMatch> | null> => {
  const tournamentCollection = collection(db, "match");
  const userQuery = query(tournamentCollection, where("author", "==", id));
  const querySnapshot = await getDocs(userQuery);
  const matches = [] as Array<IMatch>;
  querySnapshot.forEach((doc) => {
    matches.push(doc.data() as unknown as IMatch);
  });
  return matches as Array<IMatch>;
};

export const createMatch = async (match: IMatch): Promise<string> => {
  try {
    const doc = await addDoc(collection(db, "match"), match);
    return doc.id;
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const updateMatch = async (
  documentId: string,
  updatedData: Partial<IMatch>
): Promise<void> => {
  try {
    const documentRef = doc(db, "match", documentId);
    await setDoc(documentRef, updatedData, { merge: true });
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const createScore = async (score: IScore): Promise<string> => {
  try {
    const doc = await addDoc(collection(db, "score"), score);
    return doc.id;
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};
