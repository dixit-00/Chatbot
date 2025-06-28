import express from "express";
import {
  register,
  login,
  logout,
  Sendverifyotp,
  verifyEmail,
  Isauthenticated,
  ResetPassword,
  Resendotp,
} from "../controller/authcontroller.js";
import userAuth from "../MiddleWare/UserAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/Sendverifyotp", userAuth, Sendverifyotp);
authRouter.post("/verifyotp", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, Isauthenticated);
authRouter.post("/Resetotp", userAuth, Resendotp);
authRouter.post("/Resetpass", userAuth, ResetPassword);

export default authRouter;
