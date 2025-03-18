import * as express from "express";
import { addUser } from "../api/addUser";
import { getUsers } from "../api/getUsers";
import { verifyToken } from "../middleware";

const routes = express();
import cors = require("cors");

routes.use(cors({ origin: ["http://localhost:3000"] }));
routes.get("/", (req, res) => res.status(200).send("Hey there!"));
routes.post("/addUser", verifyToken, addUser);
routes.get("/getUsers", verifyToken, getUsers);

// Catch all other routes
routes.use((req, res) => {
  res.status(404).send("Not found");
});

module.exports = routes;
