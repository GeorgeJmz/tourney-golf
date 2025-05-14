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

let allowedOrigins: string[] = [];
const corsAllowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS; // Accede a la variable de entorno
if (corsAllowedOriginsEnv) {
  // Divide la cadena por comas y elimina espacios extra
  allowedOrigins = corsAllowedOriginsEnv.split(",").map(origin => origin.trim());
  functions.logger.info("CORS: Orígenes permitidos cargados desde process.env.CORS_ALLOWED_ORIGINS:", allowedOrigins);
} else {
  functions.logger.warn("CORS: La variable de entorno CORS_ALLOWED_ORIGINS no está definida. Usando fallback/defaults.");
  // Fallback para desarrollo o si la variable no está configurada
  if (process.env.FUNCTIONS_EMULATOR === "true" || process.env.NODE_ENV !== "production") {
    // Para desarrollo local, permite localhost.
    allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
  } else {
    // Para producción, si la variable no está, sé restrictivo.
    // Podrías decidir tener una lista vacía o solo tu dominio principal.
    allowedOrigins = ["https://teeboxleague.com"];
    functions.logger.warn("CORS: Fallback de producción aplicado para orígenes permitidos.");
  }
}
const corsOptions: cors.CorsOptions = {
  origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Opcional: permitir solicitudes sin origen (Postman, apps móviles) en desarrollo/emulador.
    // En producción, sé más estricto con esto según tus necesidades de seguridad.
    if (!requestOrigin && (process.env.FUNCTIONS_EMULATOR === "true" || process.env.NODE_ENV !== "production")) {
      functions.logger.info("CORS: Permitiendo solicitud sin origen en entorno de no producción/emulador.");
      return callback(null, true);
    }

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      callback(null, true); // El origen está en la lista de permitidos
    } else {
      functions.logger.error(`CORS: Origen "${requestOrigin}" no permitido. Lista de permitidos: [${allowedOrigins.join(", ")}]`);
      callback(new Error(`El origen ${requestOrigin} no está permitido por la política de CORS.`));
    }
  },
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
};
routes.use(
  cors(corsOptions)
);
routes.get("/", (req, res) => res.status(200).send("Hey there!"));
routes.get("/V", (req, res) => res.status(200).send(corsAllowedOriginsEnv));
routes.post("/addUser", verifyToken, addUser);
routes.get("/getUsers", verifyToken, getUsers);
routes.post("/getDashboardLeagues", verifyToken, getDashboardLeagues);
routes.post("/getStandings", verifyToken, getStandings);
routes.post("/getCourses", verifyToken, getCourses);
routes.post("/getOpponents", verifyToken, getOpponents);
routes.post("/createMatch", verifyToken, createMatch);

// Catch all other routes
routes.use((req, res) => {
  res.status(404).send("Not found");
});

module.exports = routes;
