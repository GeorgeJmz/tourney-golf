import * as express from "express";
import { addUser } from "../api/addUser";
import { getUsers } from "../api/getUsers";
import { getDashboardLeagues } from "../api/getDashBoardLeagues";
import { verifyToken } from "../middleware";

const routes = express();
import cors = require("cors");
import { getStandings } from "../api/getStandings";

routes.use(
  cors({ origin: ["http://localhost:3000", "https://teeboxleague.com"] })
);
routes.get("/", (req, res) => res.status(200).send("Hey there!"));
routes.post("/addUser", verifyToken, addUser);
routes.get("/getUsers", verifyToken, getUsers);
routes.post("/getDashboardLeagues", verifyToken, getDashboardLeagues);
routes.post("/getStandings", verifyToken, getStandings);

// Catch all other routes
routes.use((req, res) => {
  res.status(404).send("Not found");
});

module.exports = routes;
