export const firebaseConfigValues = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

export const APP_ENV = process.env.REACT_APP_ENV || "PRODUCTION";
export const IS_LOCAL_ENV = APP_ENV === "LOCAL";

export const FIRESTORE_EMULATOR_HOST = "127.0.0.1";
export const FIRESTORE_EMULATOR_PORT = 8081;
export const AUTH_EMULATOR_URL = `http://${FIRESTORE_EMULATOR_HOST}:9099`;
export const API_PORT = 5001;

const API_BASE_URL_LOCAL = `http://${FIRESTORE_EMULATOR_HOST}:${API_PORT}/${firebaseConfigValues.projectId}/us-central1/api`;
const API_BASE_URL_PROD = `https://us-central1-${firebaseConfigValues.projectId}.cloudfunctions.net/api`;

export const API_BASE_URL = IS_LOCAL_ENV
  ? API_BASE_URL_LOCAL
  : API_BASE_URL_PROD;

export const API_ENDPOINTS = {
  GET_USERS: "/getUsers",
  GET_DASHBOARD_LEAGUES: "/getDashboardLeagues",
  GET_STANDINGS: "/getStandings",
  GET_COURSES: "/getCourses",
  GET_OPPONENTS: "/getOpponents",
  ADD_USER: "/addUser",
  CREATE_MATCH: "/createMatch",
};
