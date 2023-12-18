import express from "express";
import multer from "multer";
import { oAuth, signIn, signOut, signUp } from "../controllers/auth.js";

const authRouter = express.Router();

const upload = multer();

authRouter.post("/signUp", upload.none(), signUp);
authRouter.post("/signIn", upload.none(), signIn);
authRouter.post("/oAuth", oAuth);
authRouter.get("/signOut", signOut);

export { authRouter };
