import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator,
  sendPasswordResetEmail,
  confirmPasswordReset,
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
  deleteDoc,
  arrayUnion,
  updateDoc,
  connectFirestoreEmulator,
} from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import type { IUser } from "../models/User";
import "firebase/database";
import "firebase/storage";
import { IPlayOffsDetail, IPlayer, ITournament } from "../models/Tournament";
import { IMatch } from "../models/Match";
import { IScore } from "../models/Score";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { ITournamentPlayer } from "../models/Player";
import {
  firebaseConfigValues,
  IS_LOCAL_ENV,
  AUTH_EMULATOR_URL,
  FIRESTORE_EMULATOR_HOST,
  FIRESTORE_EMULATOR_PORT,
  API_BASE_URL,
  API_ENDPOINTS,
} from "../config";
import "firebase/firestore";

export const firebase = initializeApp(firebaseConfigValues);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
if (IS_LOCAL_ENV) {
  connectFirestoreEmulator(
    db,
    FIRESTORE_EMULATOR_HOST,
    FIRESTORE_EMULATOR_PORT
  );
  connectAuthEmulator(auth, AUTH_EMULATOR_URL);
}

export const passwordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const confirmThePasswordReset = async (
  oobCode: string,
  newPassword: string
) => {
  if (!oobCode && !newPassword) {
    return;
  }
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const sendCustomEmail = async (
  email: string | string[],
  subject: string,
  body: string
): Promise<void> => {
  try {
    const collectionRef = collection(db, "mail");
    const emailContent = {
      to: email,
      message: {
        from: "TEEBOX League <teeboxleague@gmail.com>",
        subject: subject,
        text: body,
        html: `<p>${body}</p>`,
      },
    };
    await addDoc(collectionRef, emailContent);
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const getAllUsers = async (): Promise<void> => {
  const authToken = await auth.currentUser?.getIdToken();
  await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_USERS}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${authToken}` },
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));
};

export const getAllLeagues = async (userId: string) => {
  const authToken = await auth.currentUser?.getIdToken();
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.GET_DASHBOARD_LEAGUES}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
      mode: "cors",
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getBoard = async (leagueId: string) => {
  const authToken = await auth.currentUser?.getIdToken();
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_BOARD}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      leagueId,
    }),
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getStandings = async (tournamentId: string) => {
  const authToken = await auth.currentUser?.getIdToken();
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.GET_STANDINGS}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leagueId: tournamentId,
      }),
      mode: "cors",
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getCourses = async (userId: string) => {
  const authToken = await auth.currentUser?.getIdToken();
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_COURSES}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
    }),
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getOpponents = async (userId: string, leagueId: string) => {
  const authToken = await auth.currentUser?.getIdToken();
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.GET_OPPONENTS}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: userId,
        leagueId: leagueId,
      }),
      mode: "cors",
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const createUser = async (
  user: Partial<IUser>
): Promise<Partial<IUser>> => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      user?.email?.toLowerCase() || "",
      user.password || ""
    ).then((user) => {
      console.log(user, "user");
      return user;
    });

    const authToken = await auth.currentUser?.getIdToken();
    const firebaseUser = {
      email: user?.email?.toLowerCase(),
      id: credentials.user?.uid,
      name: user.name?.trim(),
      lastName: user.lastName,
      ghinNumber: user.ghinNumber || "",
      activeTournaments: [],
      historyTournaments: [],
    } as Omit<IUser, "sequentialUserId">;
    await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADD_USER}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(firebaseUser),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data");
        return firebaseUser;
      });

    return firebaseUser;

    // const authToken = await auth.currentUser?.getIdToken();
    // const url = IS_LOCAL_ENV
    //   ? "http://127.0.0.1:5001/teeboxleague-11e39/us-central1/api"
    //   : "https://us-central1-teeboxleague-11e39.cloudfunctions.net/api";
    // await fetch(`${url}/addUser`, {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${authToken}` },
    //   body: JSON.stringify(firebaseUser),
    //   mode: "cors",
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data, "data");
    //     return firebaseUser;
    //   });

    // const idUser = await getUserIdByEmail(user?.email?.toLowerCase() || "");
    // if (!idUser) {
    //   await addDoc(collection(db, "users"), firebaseUser);
    // } else {
    //   const userCollection = collection(db, "users");
    //   const playersCollection = collection(db, "player");
    //   const userQuery = query(
    //     userCollection,
    //     where("email", "==", user?.email?.toLowerCase())
    //   );
    //   const playersQuery = query(
    //     playersCollection,
    //     where("email", "==", user?.email?.toLowerCase())
    //   );
    //   const querySnapshot = await getDocs(userQuery);
    //   const querySnapshot2 = await getDocs(playersQuery);

    //   querySnapshot.forEach(async (dc) => {
    //     const documentRef = doc(db, "users", dc.id);
    //     await setDoc(documentRef, firebaseUser, { merge: true });
    //   });

    //   querySnapshot2.forEach(async (dc) => {
    //     const documentRef = doc(db, "player", dc.id);
    //     await setDoc(
    //       documentRef,
    //       { ...dc.data(), id: credentials.user?.uid },
    //       { merge: true }
    //     );
    //   });
    // }
    // await sendCustomEmail(
    //   user.email || "",
    //   "Welcome to TEE BOX League",
    //   "<p>Now you're ready to practice with purpose, play with an edge and become a league legend.</p><p><a href='https://teeboxleague.com/'>Login</a> to create a new league or accept a league invitation.</p>"
    // );
    // return user;
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const createMatchEndpoint = async (
  author: string,
  tournamentId: string
): Promise<void> => {
  try {
    const authToken = await auth.currentUser?.getIdToken();
    const firebaseMatch = {
      author: author,
      course: "AndalusiaCountryClub",
      courseDisplayName: "Andalusia Country Club",
      teeBox: "BlueAndalusiaCountryClub",
      teeBoxDisplayName: "Blue",
      tournamentId: tournamentId,
      scores: [
        {
          player: "Adrian Aburto",
          idPlayer: "jeckox@gmail.com",
          scoreHoles: [3, 3, 5, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 3, 5, 4, 4, 5],
          handicap: 5,
          out: 34,
          in: 36,
          totalGross: 70,
          totalNet: 70,
          teamPoints: [3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        },
        {
          player: "test1",
          idPlayer: "test1@gmail.com",
          scoreHoles: [4, 3, 5, 4, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 4, 5],
          handicap: 0,
          out: 36,
          in: 36,
          totalGross: 72,
          totalNet: 72,
          teamPoints: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        },
        {
          player: "test2",
          idPlayer: "test2@gmail.com",
          scoreHoles: [4, 3, 5, 4, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 4, 5],
          handicap: 0,
          out: 36,
          in: 36,
          totalGross: 72,
          totalNet: 72,
          teamPoints: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        },
      ],
      message: "Its Showtime",
    };
    await fetch(`${API_BASE_URL}${API_ENDPOINTS.CREATE_MATCH}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(firebaseMatch),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data");
      });
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
      email: user?.email?.toLowerCase(),
      id: user.id,
      name: user.name?.trim(),
      lastName: user.lastName,
      ghinNumber: user.ghinNumber || "",
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
    const credentials = await signInWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password
    );
    const { user } = credentials;
    const userCollection = collection(db, "users");
    const userQuery = query(userCollection, where("id", "==", user.uid));
    const querySnapshot = await getDocs(userQuery);
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
  const userQuery = query(
    userCollection,
    where("email", "==", email.toLowerCase())
  );
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
  tournamentName: string,
  player: Partial<ITournamentPlayer>
) => {
  const subject = "You have a TEE BOX League invitation";
  const mail = `<h1>Hi ${player.name}</h1>
      <p>Get ready to practice with purpose, play with an edge and become a league legend.<p>
      <p><a href="https://teeboxleague.com/" target="_blank">Login</a> to accept the ${tournamentName} invitation.</p>`;
  const userId = await getUserIdByEmail(email);
  if (userId !== "") {
    const documentRef = doc(db, "users", userId);
    const docSnap = await getDoc(documentRef);
    const activeTournaments = docSnap.data()?.activeTournaments || [];
    if (!activeTournaments.includes(tournamentId)) {
      const newAdded = {
        activeTournaments: [...new Set([...activeTournaments, tournamentId])],
      };
      await setDoc(documentRef, newAdded, { merge: true });
      const newPlayer = {
        id: userId,
        ...player,
      };
      await createPlayer(newPlayer);
      await sendCustomEmail(player.email || "", subject, mail);
    } else {
      const userCollection = collection(db, "player");

      const userQuery = query(
        userCollection,
        where("email", "==", email.toLowerCase()),
        where("tournamentId", "==", tournamentId)
      );
      const querySnapshot = await getDocs(userQuery);
      let playerData = null;
      await querySnapshot.forEach(async (dc) => {
        playerData = dc.data() as ITournamentPlayer;
        const newPlayer = {
          ...playerData,
          name: player.name,
          email: player?.email?.toLowerCase(),
          conference: player.conference,
          group: player.group,
          team: player.team,
        };
        const documentRef = doc(db, "player", dc.id);
        await setDoc(documentRef, newPlayer, { merge: true });
      });
    }
  } else {
    const firebaseUser = {
      email: player?.email?.toLowerCase(),
      id: player?.email?.toLowerCase(),
      name: player.name,
      lastName: "",
      activeTournaments: [tournamentId],
    } as IUser;
    await addDoc(collection(db, "users"), firebaseUser);
    const newPlayer = {
      id: player.email,
      ...player,
    };
    await createPlayer(newPlayer);
    await sendCustomEmail(player.email || "", subject, mail);
  }
};

export const assignNewActiveTourneyByEmail = async (
  email: string,
  removeEmail: string,
  tournamentId: string,
  tournamentName: string,
  player: Partial<ITournamentPlayer>
) => {
  const subject = "You have a TEE BOX League invitation";
  const mail = `<h1>Hi ${player.name}</h1>
      <p>Get ready to practice with purpose, play with an edge and become a league legend.<p>
      <p><a href="https://teeboxleague.com/" target="_blank">Login</a> to accept the ${tournamentName} invitation.</p>`;
  const userId = await getUserIdByEmail(email);
  console.log(userId, "userId");
  if (userId !== "") {
    const documentRef = doc(db, "users", userId);
    const docSnap = await getDoc(documentRef);
    const activeTournaments = docSnap.data()?.activeTournaments || [];
    console.log(
      activeTournaments,
      "activeTournaments",
      tournamentId,
      "tournamentId",
      email,
      "email"
    );
    if (!activeTournaments.includes(tournamentId)) {
      const newAdded = {
        activeTournaments: [...new Set([...activeTournaments, tournamentId])],
      };
      console.log(newAdded, "newAdded");
      await setDoc(documentRef, newAdded, { merge: true });
      await sendCustomEmail(player.email || "", subject, mail);
    }
  } else {
    const firebaseUser = {
      email: player?.email?.toLowerCase(),
      id: player?.email?.toLowerCase(),
      name: player.name,
      lastName: "",
      activeTournaments: [tournamentId],
    } as IUser;
    console.log(firebaseUser, "firebaseUser");
    await addDoc(collection(db, "users"), firebaseUser);
    await sendCustomEmail(player.email || "", subject, mail);
  }
  const removeUserId = await getUserIdByEmail(removeEmail);
  console.log(removeUserId, "removeUserId");
  if (removeUserId !== "") {
    const documentRef = doc(db, "users", removeUserId);
    const docSnap = await getDoc(documentRef);
    const activeTournaments = docSnap.data()?.activeTournaments || [];
    console.log(
      activeTournaments,
      "activeTournaments",
      tournamentId,
      "tournamentId",
      removeEmail,
      "removeEmail"
    );
    if (activeTournaments.includes(tournamentId)) {
      const newAdded = {
        activeTournaments: activeTournaments.filter(
          (tournament: string) => tournament !== tournamentId
        ),
      };
      console.log(newAdded, "newAdded-Remove");
      await setDoc(documentRef, newAdded, { merge: true });
    }
  }
};

export const updateHistoryLeagues = async (
  emails: Array<string>,
  tournamentId: string
) => {
  const userQuery = query(
    collection(db, "users"),
    where("email", "in", emails)
  );
  const querySnapshot = await getDocs(userQuery);

  await querySnapshot.forEach(async (doc) => {
    const activeTournaments = doc.data()?.activeTournaments || [];
    const historyTournaments = doc.data()?.historyTournaments || [];
    const newAdded = {
      activeTournaments: activeTournaments.filter(
        (tournament: string) => tournament !== tournamentId
      ),
      historyTournaments: [...new Set([...historyTournaments, tournamentId])],
    };

    await setDoc(doc.ref, newAdded, { merge: true });
  });
};

export const updateLeagueNameAndChampion = async (
  tournamentId: string,
  leagueName: string,
  champion: string
) => {
  const documentRefTournament = doc(db, "tournament", tournamentId);

  await setDoc(
    documentRefTournament,
    { name: leagueName, champion, status: "closed" },
    { merge: true }
  );
};

export const deleteActiveTourneyById = async (tournamentId: string) => {
  const updateUser = async (email: string) => {
    const userId = await getUserIdByEmail(email.toLowerCase());
    const documentRef = doc(db, "users", userId);
    const docSnap = await getDoc(documentRef);
    const activeUser = docSnap.data();
    const activeTournaments = docSnap.data()?.activeTournaments || [];
    const newUser = {
      ...activeUser,
      activeTournaments: activeTournaments.filter(
        (tournament: string) => tournament !== tournamentId
      ),
    };
    await setDoc(documentRef, newUser, { merge: true });
  };

  const updateTournament = async () => {
    const documentRef = doc(db, "tournament", tournamentId);
    const docSnap = await getDoc(documentRef);
    const activeTournament = docSnap.data() as ITournament;
    const players = activeTournament?.playersList || [];

    players.forEach(
      async (player) => await updateUser(player?.email?.toLowerCase() || "")
    );

    await deleteDoc(doc(db, "tournament", tournamentId));
  };

  const updatePlayer = async () => {
    const playeCollection = collection(db, "player");
    const playerQuery = query(
      playeCollection,
      where("tournamentId", "==", tournamentId)
    );
    const querySnapshot = await getDocs(playerQuery);

    const idPLayers: Array<string> = [];
    querySnapshot.forEach((doc) => {
      idPLayers.push(doc.id);
    });

    idPLayers.forEach(
      async (value: string) => await deleteDoc(doc(db, "player", value))
    );
  };

  const updateMatch = async () => {
    const matchCollection = collection(db, "match");
    const matchQuery = query(
      matchCollection,
      where("tournamentId", "==", tournamentId)
    );
    const querySnapshot = await getDocs(matchQuery);

    const idMatches: Array<string> = [];
    querySnapshot.forEach((doc) => {
      idMatches.push(doc.id);
    });

    idMatches.forEach(
      async (value: string) => await deleteDoc(doc(db, "match", value))
    );
  };

  //if (userId !== "") {
  //updateUser();
  await updateTournament();
  await updatePlayer();
  await updateMatch();
  //}
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

export const updatePlayerAllFields = async (
  player: ITournamentPlayer
): Promise<void> => {
  const playerRef = doc(db, "player", player.id);
  //const docSnap = await getDoc(playerRef);
  await setDoc(playerRef, player, { merge: true });
};

export const updatePlayerListByTournamentId = async (
  tournamentId: string,
  players: Partial<IPlayer>[]
): Promise<void> => {
  getTournamentsById([tournamentId]).then(async (tournament) => {
    if (tournament) {
      const currentTournament = tournament[0];
      console.log(currentTournament, "currentTournament");
      console.log("new", {
        ...currentTournament,
        playersList: players,
      });
      await updateTournament(tournamentId, {
        ...currentTournament,
        playersList: players,
      });
    }
  });
};

export const updatePlayer = async (player: {
  email: string;
  opponent: string;
  pointsMatch: number;
  pointsStroke: number;
  pointsTeam: number;
  scoreId: string;
  tournamentId: string;
  gross: number;
  handicap: number;
  net: number;
  date: string;
}): Promise<void> => {
  try {
    const userCollection = collection(db, "player");
    const userQuery = query(
      userCollection,
      where("email", "==", player.email.toLowerCase()),
      where("tournamentId", "==", player.tournamentId)
    );

    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      // No player document found, handle the case (e.g., create a new document)
      return;
    }

    const playerDoc = querySnapshot.docs[0]; // Assuming only one matching document
    const updateData = {
      opponent: arrayUnion(player.opponent),
      pointsMatch: [...playerDoc.data().pointsMatch, player.pointsMatch],
      pointsStroke: [...playerDoc.data().pointsStroke, player.pointsStroke],
      pointsTeam: [...playerDoc.data().pointsTeam, player.pointsTeam],
      scoreId: arrayUnion(player.scoreId),
      gross: [...playerDoc.data().gross, player.gross],
      handicap: [...playerDoc.data().handicap, player.handicap],
      net: [...playerDoc.data().net, player.net],
      date: playerDoc.data().date
        ? [...playerDoc.data().date, player.date]
        : [player.date],
    };

    await updateDoc(doc(db, "player", playerDoc.id), updateData);
  } catch (error) {
    console.log("Error updating player", error);
    const code = error as FirebaseError;
    throw code;
  }
};

export const removePlayerFromTournament = async (
  email: string,
  tournamentId: string
): Promise<void> => {
  console.log(tournamentId, "tournamentId");
  console.log(email, "email");
  const userCollection = collection(db, "player");
  const userQuery = query(
    userCollection,
    where("email", "==", email.toLowerCase()),
    where("tournamentId", "==", tournamentId)
  );

  const querySnapshot = await getDocs(userQuery);

  querySnapshot.forEach(async (dc) => {
    console.log(dc.id, "dc.id");
    console.log(dc.data(), "dc.data()");
    await deleteDoc(doc(db, "player", dc.id));
  });
};

export const updatePlayOffPlayer = async (player: {
  email: string;
  opponent: string;
  pointsMatch: number;
  pointsStroke: number;
  pointsTeam: number;
  scoreId: string;
  tournamentId: string;
  gross: number;
  handicap: number;
  net: number;
  date: string;
}): Promise<void> => {
  try {
    const userCollection = collection(db, "playerPlayoff");
    const userQuery = query(
      userCollection,
      where("email", "==", player.email.toLowerCase()),
      where("tournamentId", "==", player.tournamentId)
    );

    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      const playerData = {
        email: player.email.toLowerCase(),
        opponent: [player.opponent],
        pointsMatch: [player.pointsMatch],
        pointsStroke: [player.pointsStroke],
        pointsTeam: [player.pointsTeam],
        scoreId: [player.scoreId],
        tournamentId: player.tournamentId,
        gross: [player.gross],
        handicap: [player.handicap],
        net: [player.net],
        date: [player.date],
      };
      await addDoc(collection(db, "playerPlayoff"), playerData);
      // No player document found, handle the case (e.g., create a new document)
      return;
    }

    const playerDoc = querySnapshot.docs[0]; // Assuming only one matching document
    const updateData = {
      opponent: arrayUnion(player.opponent),
      pointsMatch: [...playerDoc.data().pointsMatch, player.pointsMatch],
      pointsStroke: [...playerDoc.data().pointsStroke, player.pointsStroke],
      pointsTeam: [...playerDoc.data().pointsTeam, player.pointsTeam],
      scoreId: arrayUnion(player.scoreId),
      gross: [...playerDoc.data().gross, player.gross],
      handicap: [...playerDoc.data().handicap, player.handicap],
      net: [...playerDoc.data().net, player.net],
      date: playerDoc.data().date
        ? [...playerDoc.data().date, player.date]
        : [player.date],
    };

    await updateDoc(doc(db, "playerPlayoff", playerDoc.id), updateData);
  } catch (error) {
    console.log("Error updating player", error);
    const code = error as FirebaseError;
    throw code;
  }
};

// export const updatePlayer = async (player: {
//   email: string;
//   opponent: string;
//   pointsMatch: number;
//   pointsStroke: number;
//   pointsTeam: number;
//   scoreId: string;
//   tournamentId: string;
//   gross: number;
//   handicap: number;
//   net: number;
// }): Promise<void> => {
//   try {
//     const userCollection = collection(db, "player");
//     const userQuery = query(
//       userCollection,
//       where("email", "==", player.email.toLowerCase()),
//       where("tournamentId", "==", player.tournamentId)
//     );
//     const querySnapshot = await getDocs(userQuery);
//     let playerData = null;
//     await querySnapshot.forEach(async (dc) => {
//       playerData = dc.data() as ITournamentPlayer;
//       const newPlayer = {
//         ...playerData,
//         opponent: [...(playerData.opponent || []), player.opponent],
//         pointsMatch: [...(playerData.pointsMatch || []), player.pointsMatch],
//         pointsStroke: [...(playerData.pointsStroke || []), player.pointsStroke],
//         pointsTeam: [...(playerData.pointsTeam || []), player.pointsTeam],
//         scoreId: [...(playerData.scoreId || []), player.scoreId],
//         gross: [...(playerData.gross || []), player.gross],
//         handicap: [...(playerData.handicap || []), player.handicap],
//         net: [...(playerData.net || []), player.net],
//       };
//       const documentRef = doc(db, "player", dc.id);
//       await setDoc(documentRef, newPlayer, { merge: true });
//     });
//   } catch (error) {
//     const code = error as FirebaseError;
//     throw code;
//   }
// };

export const updatePlayerToAddMissingFields = async (): Promise<void> => {
  const playerCollection = collection(db, "player");

  const userQuery = query(playerCollection);
  const querySnapshot = await getDocs(userQuery);
  const players = [] as Array<ITournamentPlayer>;
  querySnapshot.forEach((doc) => {
    players.push({ ...doc.data(), id: doc.id } as unknown as ITournamentPlayer);
  });

  players.map(async (player) => {
    const gross: Array<number> = [],
      handicap: Array<number> = [],
      net: Array<number> = [];
    for (const scoreID of player.scoreId) {
      const thisScore = await getScoresByID(scoreID);
      gross.push(parseInt(thisScore?.totalGross?.toString() ?? "0"));
      handicap.push(parseInt(thisScore?.handicap?.toString() ?? "0"));
      net.push(parseInt(thisScore?.totalNet?.toString() ?? "0"));
    }
    await Promise.all([gross, handicap, net]);

    console.log(player, "previous player");

    try {
      const documentRef = doc(db, "player", player.id);
      const updatedData = {
        ...player,
        gross,
        handicap,
        net,
      };

      console.log(updatedData, "player");
      console.table(updatedData);
      await setDoc(documentRef, updatedData, { merge: true });
    } catch (error) {
      const code = error as FirebaseError;
      throw code;
    }
  });
};

export const getPlayersByTournamentId = async (
  id: string
): Promise<Array<ITournamentPlayer>> => {
  const playerCollection = collection(db, "player");
  const userQuery = query(playerCollection, where("tournamentId", "==", id));
  const querySnapshot = await getDocs(userQuery);
  const players = [] as Array<ITournamentPlayer>;
  querySnapshot.forEach((doc) => {
    players.push({ ...doc.data(), id: doc.id } as unknown as ITournamentPlayer);
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
    console.log(updatedData, "updatedData");
    await setDoc(documentRef, updatedData, { merge: true });
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const getTournamentsById = async (
  ids: Array<string>
): Promise<Array<ITournament> | null> => {
  console.log(ids, "ids");
  const tournamentCollection = collection(db, "tournament");
  const userQuery = query(tournamentCollection, where("id", "in", ids));
  const querySnapshot = await getDocs(userQuery);
  const tournaments = [] as Array<ITournament>;
  const mapTournaments = new Map<string, ITournament>();
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "doc.id()");
    mapTournaments.set(doc.id, {
      ...doc.data(),
      id: doc.id,
    } as unknown as ITournament);
    tournaments.push({ ...doc.data(), id: doc.id } as unknown as ITournament);
  });
  console.log(mapTournaments, "tournaments");
  return tournaments as Array<ITournament>;
};

export const addPlayOffsToTournament = async (
  tournamentId: string,
  playOffs: Partial<IPlayOffsDetail>
): Promise<void> => {
  try {
    const documentRef = doc(db, "tournament", tournamentId);
    await setDoc(documentRef, { playOffsDetail: playOffs }, { merge: true });
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const getNamesByEmails = async (
  emails: Array<string>
): Promise<Array<IUser> | null> => {
  const users: IUser[] = [];
  const chunkSize = 30;

  for (let i = 0; i < emails.length; i += chunkSize) {
    const chunk = emails.slice(i, i + chunkSize);
    const userQuery = query(
      collection(db, "users"),
      where("email", "in", chunk)
    );
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach((doc) => {
      users.push(doc.data() as IUser);
    });
  }

  return users;
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
    matches.push({ ...doc.data(), id: doc.id } as unknown as IMatch);
  });

  return matches || ([] as Array<IMatch>);
};

export const getPlayoffsMatchesByTournamentId = async (
  id: string
): Promise<Array<IMatch>> => {
  const tournamentCollection = collection(db, "matchplayoff");
  const userQuery = query(
    tournamentCollection,
    where("tournamentId", "==", id)
  );
  const querySnapshot = await getDocs(userQuery);
  const matches = [] as Array<IMatch>;
  querySnapshot.forEach((doc) => {
    matches.push({ ...doc.data(), id: doc.id } as unknown as IMatch);
  });

  return matches || ([] as Array<IMatch>);
};

export const getMatchesByTournamentIdAndRound = async (
  id: string,
  round: number
): Promise<Array<IMatch>> => {
  const tournamentCollection = collection(db, "match");
  const userQuery = query(
    tournamentCollection,
    where("tournamentId", "==", id),
    where("round", "==", round)
  );
  const querySnapshot = await getDocs(userQuery);
  const matches = [] as Array<IMatch>;
  querySnapshot.forEach((doc) => {
    matches.push({ ...doc.data(), id: doc.id } as unknown as IMatch);
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

export const createPlayoffMatch = async (match: IMatch): Promise<string> => {
  try {
    const doc = await addDoc(collection(db, "matchplayoff"), match);
    return doc.id;
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
  }
};

export const deleteMatch = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "match", id));
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

export const updateDateFromPlayer = async (
  previousDate: string,
  newDate: string,
  emailLists: Array<string>,
  tournamentId: string
) => {
  const playerCollection = collection(db, "player");
  const userQuery = query(
    playerCollection,
    where("email", "in", emailLists),
    where("tournamentId", "==", tournamentId)
  );

  const querySnapshot = await getDocs(userQuery);
  querySnapshot.forEach(async (dc) => {
    const playerData = dc.data() as ITournamentPlayer;
    const newPlayer = {
      ...playerData,
      date: playerData.date?.map((d) => (d === previousDate ? newDate : d)),
    };
    console.log(playerData, "prevPlayer");
    console.log(newPlayer, "newPlayer");
    const documentRef = doc(db, "player", dc.id);
    await setDoc(documentRef, newPlayer, { merge: true });
  });
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

export const deleteScore = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "score", id));
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

export const updateScore = async (
  documentId: string,
  updatedData: Partial<IScore>
): Promise<void> => {
  try {
    const documentRef = doc(db, "score", documentId);
    await setDoc(documentRef, updatedData, { merge: true });
  } catch (error) {
    const code = error as FirebaseError;
    throw code;
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

export const uploadIMGData = async (
  dataURL: Blob | Uint8Array | ArrayBuffer,
  name: string,
  emails: string[]
): Promise<void> => {
  try {
    const storageRef = ref(storage, `brackets/${name}.png`);
    const uploadTask = uploadBytesResumable(storageRef, dataURL);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is in progress");
            break;
        }
      },
      (error) => {
        // Handle upload errors
        console.error("Error uploading image:", error);
      },
      async () => {
        // Get download URL after successful upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const emailBody = `
          <html>
            <body>
              <h3>Here is the latest playoff bracket:</h3>
              <img src="${downloadURL}" width="300px" alt="Bracket Image">
            </body>
          </html>
        `;

        sendCustomEmail(emails, `Playoffs ${name}`, emailBody);
      }
    );
  } catch (error) {
    console.error("Error capturing image:", error);
  }
};

export const uploadIMG = async (file: File, name: string): Promise<string> => {
  try {
    const storageRef = ref(storage, "imgs/" + name);
    const snap = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snap.ref);
    return url;
  } catch (error) {
    const code = error as FirebaseError;
    return "";
  }
};

export const getIMGUrl = async (name: string): Promise<string> => {
  try {
    const storageRef = ref(storage, "imgs/" + name);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    const code = error as FirebaseError;
    return "";
  }
};

// export const checkIfMatchExist = async (
//   player1: string,
//   player2: string,
//   tournamentId: string
// ): Promise<boolean> => {
//   // Create a base query for the "match" collection
//   const queryMatch = collection(db, "match");

//   // Build the first where clause for player1
//   const whereClause1 = query(
//     queryMatch,
//     where("tournamentId", "==", tournamentId),
//     where("matchResults[0].idPlayer", "==", player1), // Use array-contains for array filtering
//     where("matchResults[1].idPlayer", "==", player2) // Use array-contains for array filtering
//   );

//   // Build the second where clause for player2
//   const whereClause2 = query(
//     queryMatch,
//     where("tournamentId", "==", tournamentId),
//     where("matchResults[0].idPlayer", "==", player2), // Use array-contains for array filtering
//     where("matchResults[1].idPlayer", "==", player1) // Use array-contains for array filtering
//   );

//   // Execute the queries and get snapshots
//   const snapshot1 = await getDocs(whereClause1);
//   const snapshot2 = await getDocs(whereClause2);

//   console.log(whereClause1, "whereClause1");
//   console.log(whereClause2, "whereClause2");
//   console.log(snapshot1.size);
//   console.log(snapshot2.size);

//   console.log(snapshot1.docs);
//   console.log(snapshot2.docs);

//   // Check if either snapshot has documents (meaning a match exists)
//   return !snapshot1.empty || !snapshot2.empty;
// };

export const checkIfMatchExist = async (
  player1: string,
  player2: string,
  tournamentId: string
): Promise<boolean> => {
  const matches = await getMatchesByTournamentId(tournamentId);
  const exist = matches.some((match) => {
    if (
      match.matchResults[0].idPlayer === player1 &&
      match.matchResults[1].idPlayer === player2
    ) {
      return true;
    }
    if (
      match.matchResults[1].idPlayer === player1 &&
      match.matchResults[0].idPlayer === player2
    ) {
      return true;
    }
  });
  return exist;
};

export const updateMatches = async (): Promise<void> => {
  const collectionRef = collection(db, "match");
  getDocs(collectionRef).then((querySnapshot) => {
    querySnapshot.forEach((docSnapshot) => {
      const matchResultsData = docSnapshot.data().matchResults[0];
      const matchResultsData1 = docSnapshot.data().matchResults[1];
      const newMatchResultsObject: { [key: string]: string[] | number[] } = {}; // Add index signature

      for (const property in matchResultsData) {
        newMatchResultsObject[property] = [
          matchResultsData[property],
          matchResultsData1[property],
        ];
      }

      const docRef = doc(db, "match", docSnapshot.id);
      console.log(newMatchResultsObject, "newMatchResultsObject");
      //updateDoc(docRef, { matchResults: newMatchResultsObject });
    });
  });
};
