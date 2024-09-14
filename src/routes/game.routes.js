import { Router } from "express";

import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  allScore,
  getScore,
  updateScore,
} from "../controller/score.controller.js";

const gameRouter = Router();

gameRouter.route("/updateScore").post(verifyJwt, updateScore);
gameRouter.route("/getScore").get(verifyJwt, getScore);
gameRouter.route("/leaderboard").post(allScore);

export default gameRouter;
