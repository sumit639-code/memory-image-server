import { Router } from "express";

import { verifyJwt } from "../middleware/auth.middleware.js";
import { updateScore } from "../controller/score.controller.js";

const gameRouter = Router();

gameRouter.route("/updateScore").post(verifyJwt, updateScore);

export default gameRouter;
