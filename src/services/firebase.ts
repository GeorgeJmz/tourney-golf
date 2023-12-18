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
  getDoc,
  query,
  where,
} from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import type { IUser } from "../models/User";
import "firebase/database";
import "firebase/storage";
import { IPlayer, ITournament } from "../models/Tournament";
import { IMatch } from "../models/Match";
import { IScore } from "../models/Score";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { ITournamentPlayer } from "../models/Player";
import { el, pl } from "@faker-js/faker";

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
export const storage = getStorage();

export const createUser = async (
  user: Partial<IUser>
): Promise<Partial<IUser>> => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      user.email || "",
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
export const updateUser = async (
  user: Partial<IUser>
): Promise<Partial<IUser>> => {
  try {
    const firebaseUser = {
      email: user.email,
      id: user.id,
      name: user.name,
      lastName: user.lastName,
    } as IUser;

    const userCollection = collection(db, "users");
    const userQuery = query(userCollection, where("id", "==", user.id));
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach(async (dc) => {
      const documentRef = doc(db, "users", dc.id);
      await setDoc(documentRef, firebaseUser, { merge: true });
    });
    return user;
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const createDBUser = async (user: Partial<IUser>): Promise<void> => {
  try {
    await addDoc(collection(db, "users"), user);
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

export const getUserIdByEmail = async (email: string): Promise<string> => {
  const userCollection = collection(db, "users");
  const userQuery = query(userCollection, where("email", "==", email));
  const querySnapshot = await getDocs(userQuery);
  if (querySnapshot.empty) {
    return "";
  }
  let userId = "";
  querySnapshot.forEach((doc) => {
    userId = doc.id;
  });
  return userId;
};

export const assignActiveTourneyByEmail = async (
  email: string,
  tournamentId: string,
  player: Partial<ITournamentPlayer>
) => {
  const userId = await getUserIdByEmail(email);
  if (userId !== "") {
    const documentRef = doc(db, "users", userId);
    const docSnap = await getDoc(documentRef);
    const activeTournaments = docSnap.data()?.activeTournaments || [];
    console.log(activeTournaments, "activeTournaments  ---->");
    if (!activeTournaments.includes(tournamentId)) {
      const newAdded = {
        activeTournaments: [...new Set([...activeTournaments, tournamentId])],
      };
      console.log(newAdded, "newAdded  ---->");
      await setDoc(documentRef, newAdded, { merge: true });
      const newPlayer = {
        id: userId,
        ...player,
      };
      console.log(newPlayer, "newPlayer  ---->");
      await createPlayer(newPlayer);
    } else {
      const userCollection = collection(db, "player");

      const userQuery = query(
        userCollection,
        where("email", "==", email),
        where("tournamentId", "==", tournamentId)
      );
      const querySnapshot = await getDocs(userQuery);
      let playerData = null;
      await querySnapshot.forEach(async (dc) => {
        console.log(dc.id, " => ", dc.data());
        playerData = dc.data() as ITournamentPlayer;
        console.log(playerData, "playerData Before---------");
        const newPlayer = {
          ...playerData,
          name: player.name,
          email: player.email,
          conference: player.conference,
          group: player.group,
          team: player.team,
        };
        console.log(newPlayer, "newPlayer", "----->");
        const documentRef = doc(db, "player", dc.id);
        await setDoc(documentRef, newPlayer, { merge: true });
        console.log("Document updated with ID: ", dc.id);
      });
    }
    console.log("Fin  ---->", email);
  }
};

export const createPlayer = async (
  player: Partial<ITournamentPlayer>
): Promise<string> => {
  try {
    const doc = await addDoc(collection(db, "player"), player);
    return doc.id;
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const updatePlayer = async (player: {
  email: string;
  opponent: string;
  pointsMatch: number;
  pointsStroke: number;
  pointsTeam: number;
  scoreId: string;
  tournamentId: string;
}): Promise<void> => {
  try {
    const userCollection = collection(db, "player");
    const userQuery = query(
      userCollection,
      where("email", "==", player.email),
      where("tournamentId", "==", player.tournamentId)
    );
    const querySnapshot = await getDocs(userQuery);
    let playerData = null;
    await querySnapshot.forEach(async (dc) => {
      console.log(dc.id, " => ", dc.data());
      playerData = dc.data() as ITournamentPlayer;
      console.log(playerData, "playerData Before---------");
      const newPlayer = {
        ...playerData,
        opponent: [...(playerData.opponent || []), player.opponent],
        pointsMatch: [...(playerData.pointsMatch || []), player.pointsMatch],
        pointsStroke: [...(playerData.pointsStroke || []), player.pointsStroke],
        pointsTeam: [...(playerData.pointsTeam || []), player.pointsTeam],
        scoreId: [...(playerData.scoreId || []), player.scoreId],
      };
      console.log(newPlayer, "newPlayer", "----->");
      const documentRef = doc(db, "player", dc.id);
      await setDoc(documentRef, newPlayer, { merge: true });
      console.log("Document updated with ID: ", dc.id);
    });
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const getPlayersByTournamentId = async (
  id: string
): Promise<Array<ITournamentPlayer> | null> => {
  const playerCollection = collection(db, "player");
  const userQuery = query(playerCollection, where("tournamentId", "==", id));
  const querySnapshot = await getDocs(userQuery);
  const players = [] as Array<ITournamentPlayer>;
  querySnapshot.forEach((doc) => {
    players.push(doc.data() as unknown as ITournamentPlayer);
  });
  return players as Array<ITournamentPlayer>;
};

export const createTournament = async (
  tournament: Partial<ITournament>
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

export const getTournamentsByAuthorID = async (
  id: string
): Promise<Array<ITournament> | null> => {
  const tournamentCollection = collection(db, "tournament");
  const userQuery = query(tournamentCollection, where("author", "==", id));
  const querySnapshot = await getDocs(userQuery);
  const tournaments = [] as Array<ITournament>;
  querySnapshot.forEach((doc) => {
    tournaments.push({ ...doc.data(), id: doc.id } as unknown as ITournament);
  });
  return tournaments as Array<ITournament>;
};

export const getTournamentsById = async (
  ids: Array<string>
): Promise<Array<ITournament> | null> => {
  const tournamentCollection = collection(db, "tournament");
  const userQuery = query(tournamentCollection, where("id", "in", ids));
  const querySnapshot = await getDocs(userQuery);
  const tournaments = [] as Array<ITournament>;
  querySnapshot.forEach((doc) => {
    tournaments.push({ ...doc.data(), id: doc.id } as unknown as ITournament);
  });
  return tournaments as Array<ITournament>;
};

export const getMatchesByTournamentId = async (
  id: string
): Promise<Array<IMatch>> => {
  const tournamentCollection = collection(db, "match");
  const userQuery = query(
    tournamentCollection,
    where("tournamentId", "==", id)
  );
  const querySnapshot = await getDocs(userQuery);
  const matches = [] as Array<IMatch>;
  querySnapshot.forEach((doc) => {
    matches.push(doc.data() as unknown as IMatch);
  });
  return matches || ([] as Array<IMatch>);
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

export const getScoresByID = async (id: string): Promise<IScore | null> => {
  const documentRef = doc(db, "score", id);
  let document = null;
  try {
    const docSnapshot = await getDoc(documentRef);
    if (docSnapshot.exists()) {
      document = docSnapshot.data();
      return document as IScore;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const uploadPdf = async (file: File, name: string): Promise<string> => {
  try {
    const storageRef = ref(storage, "pdfs/" + name);
    const snap = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snap.ref);
    return url;
  } catch (error) {
    const code = error as FirebaseError;
    return "";
  }
};

export const getPdfUrl = async (name: string): Promise<string> => {
  try {
    const storageRef = ref(storage, "pdfs/" + name);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    const code = error as FirebaseError;
    return "";
  }
};
