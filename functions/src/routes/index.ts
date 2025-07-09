import * as express from "express";
import { addUser } from "../api/addUser";
import { getUsers } from "../api/getUsers";
import { getDashboardLeagues } from "../api/getDashBoardLeagues";
import { getOpponents } from "../api/getOpponents";
import { verifyToken } from "../middleware";
import * as functions from "firebase-functions";
const routes = express();
import cors = require("cors");
import { getStandings } from "../api/getStandings";
import { getCourses } from "../api/getCourses";
import { createMatch } from "../api/createMatch";
import { getBoard } from "../api/getBoard";
import { getStats } from "../api/getStats";
import { deleteAccount, reactivateAccount, requestAccountReactivation, reactivateAccountWithToken } from "../api/deleteAccount";

const MODO_PRUEBA_CORS_PERMISIVO = true;

let allowedOrigins: string[] = [];
const corsAllowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS;

if (corsAllowedOriginsEnv) {
  allowedOrigins = corsAllowedOriginsEnv
    .split(",")
    .map((origin) => origin.trim());
  functions.logger.info(
    "CORS: Orígenes permitidos cargados desde process.env.CORS_ALLOWED_ORIGINS:",
    allowedOrigins
  );
} else {
  functions.logger.warn(
    "CORS: La variable de entorno CORS_ALLOWED_ORIGINS no está definida. Usando fallback/defaults."
  );

  if (
    process.env.FUNCTIONS_EMULATOR === "true" ||
    process.env.NODE_ENV !== "production"
  ) {
    allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
  } else {
    allowedOrigins = ["https://teeboxleague.com"];
  }
  functions.logger.info(
    "CORS: Orígenes de fallback aplicados:",
    allowedOrigins
  );
}

const corsOptions: cors.CorsOptions = {
  origin: (
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (MODO_PRUEBA_CORS_PERMISIVO) {
      if (
        (requestOrigin && allowedOrigins.includes(requestOrigin)) ||
        !requestOrigin ||
        requestOrigin === "undefined"
      ) {
        if (!requestOrigin || requestOrigin === "undefined") {
          functions.logger.info(
            `CORS (MODO_PRUEBA_PERMISIVO): Permitiendo solicitud con origen especial "${requestOrigin}".`
          );
        }
        callback(null, true);
      } else {
        functions.logger.error(
          `CORS (MODO_PRUEBA_PERMISIVO): Origen "${requestOrigin}" no permitido. Lista de permitidos: [${allowedOrigins.join(
            ", "
          )}] (y orígenes especiales).`
        );
        callback(
          new Error(
            `El origen ${requestOrigin} no está permitido por la política de CORS en modo prueba.`
          )
        );
      }
    } else {
      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        functions.logger.error(
          `CORS (MODO PRODUCCIÓN ESTRICTO): Origen "${requestOrigin}" no permitido. Lista de permitidos: [${allowedOrigins.join(
            ", "
          )}]`
        );
        callback(
          new Error(
            `El origen ${requestOrigin} no está permitido por la política de CORS.`
          )
        );
      }
    }
  },
};

routes.use(cors(corsOptions));

routes.get("/", (req, res) => res.status(200).send("Hey there!"));
routes.get("/V", (req, res) => {
  const response = {
    modoPruebaCorsPermisivo: MODO_PRUEBA_CORS_PERMISIVO,
    corsAllowedOriginsEnv: corsAllowedOriginsEnv ?? "No definida",
    effectiveAllowedOrigins: allowedOrigins,
  };
  res.status(200).json(response);
});
routes.post("/addUser", verifyToken, addUser);
routes.get("/getUsers", verifyToken, getUsers);
routes.post("/getDashboardLeagues", verifyToken, getDashboardLeagues);
routes.post("/getStandings", verifyToken, getStandings);
routes.post("/getCourses", verifyToken, getCourses);
routes.post("/getOpponents", verifyToken, getOpponents);
routes.post("/createMatch", verifyToken, createMatch);
routes.post("/getBoard", verifyToken, getBoard);
routes.post("/getStats", verifyToken, getStats);
routes.post("/deleteAccount", verifyToken, deleteAccount);
routes.post("/reactivateAccount", verifyToken, reactivateAccount);
routes.post("/requestAccountReactivation", requestAccountReactivation);
routes.post("/reactivateAccountWithToken", reactivateAccountWithToken);

routes.use((req, res) => {
  res.status(404).send("Not found");
});

module.exports = routes;
