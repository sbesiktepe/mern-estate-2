import express from "express";
import { deleteUser, getUser, updateUser } from "../controllers/user.js";
import multer from "multer";
import { verifyToken } from "../middlewares/verifyUser.js";

const userRouter = express.Router();

const storage = multer.memoryStorage(); // Store the file in memory

const upload = multer({
  storage,
}); // Specify the destination folder for uploaded files
userRouter.post(
  "/updateUser/:id",
  verifyToken,
  upload.single("avatar"),
  updateUser
);
userRouter.delete("/deleteUser/:id", verifyToken, deleteUser);
userRouter.get("/getUser/:id", getUser);

export { userRouter };
