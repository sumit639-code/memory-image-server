import { Router } from "express";
import {
  getUser,
  userLogin,
  userLogout,
  userRegister,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post( userRegister);
userRouter.route("/login").post( userLogin);
userRouter.route("/logout").post(verifyJwt, userLogout);
userRouter.route("/getUser").post(verifyJwt, getUser);

export default userRouter;
