import { Router } from "express";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post( userRegister);
userRouter.route("/login").post( userLogin);
userRouter.route("/logout").post(verifyJwt, userLogout);

export default userRouter;
