import express from "express";
import userAuth from "../MiddleWare/UserAuth.js";
import { getUserdata } from "../controller/Usercontroller.js";
import cookieParser from "cookie-parser";

const app = express();

const userRouter = express.Router();
app.use(cookieParser());

userRouter.get("/data", userAuth, getUserdata);

export default userRouter;
