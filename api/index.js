import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import env from "dotenv";
import { authRouter } from "./routes/auth.js";
import { db } from "./config/db.js";
import { userRouter } from "./routes/user.js";
import { listingRouter } from "./routes/listing.js";
import path from "path";

env.config();

const app = express();

const __dirname = path.resolve();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

db();

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use("/", (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    console.log(err.message);
  }

  const errorMessage = {
    success: false,
    statusCode,
    errorMessage: message,
  };

  res.status(statusCode).json({
    errorMessage,
  });
});

app.listen(process.env.PORT || 5001, () => {
  console.log("Server is Running on ", process.env.PORT || 5001);
});
