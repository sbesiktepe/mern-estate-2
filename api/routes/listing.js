import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/verifyUser.js";
import {
  createListing,
  deleteListing,
  searchListing,
  showListing,
  showUserListings,
  updateListing,
} from "../controllers/listing.js";

const listingRouter = express.Router();

const storage = multer.memoryStorage(); // Store the file in memory

const upload = multer({
  storage,
}); // Specify the destination folder for uploaded files
listingRouter.post(
  "/createListing",
  verifyToken,
  upload.array("files"),
  createListing
);
listingRouter.get("/showListing/:id", showListing);
listingRouter.get("/showUserListings/:id", verifyToken, showUserListings);
listingRouter.delete(
  "/deleteListing/:listingId/:userId",
  verifyToken,
  deleteListing
);
listingRouter.post(
  "/updateListing",
  verifyToken,
  upload.array("files"),
  updateListing
);
listingRouter.get("/searchListing", searchListing);

export { listingRouter };
