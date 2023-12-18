import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) {
      console.log(err);
      return next(errorHandler(403, "Forbidden"));
    }
    req.user = user;
    next();
  });
};
