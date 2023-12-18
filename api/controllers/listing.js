import { listingModel } from "../models/listing.js";
import { errorHandler } from "../utils/errorHandler.js";
import { bucket } from "../utils/serviceAccount.js";

export const createListing = async (req, res, next) => {
  if (req.body.userRef !== req.user.id) {
    return next(
      errorHandler(403, "You can only make changes for your account")
    );
  }
  const files = req.files;
  const {
    name,
    description,
    address,
    type,
    bedrooms,
    baths,
    regularPrice,
    discountPrice,
    offer,
    parking,
    furnished,
    userRef,
  } = req.body;

  const fileDataArray = [];

  try {
    for (const file of files) {
      const storageFilePath = "" + file.originalname + new Date(Date.now());
      const fileUpload = bucket.file(storageFilePath);

      const result = await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      const downloadUrl = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });

      fileDataArray.push({ public_path: storageFilePath, url: downloadUrl[0] });
    }

    const newListing = await listingModel.create({
      name,
      description,
      address,
      type,
      bedrooms,
      baths,
      regularPrice,
      discountPrice,
      offer,
      parking,
      furnished,
      files: fileDataArray,
      userRef,
    });

    res.json({
      message: "Files uploaded and document saved successfully",
      newListing,
    });
  } catch (error) {
    console.error("Error uploading files and saving document:", error);
    return next(error);
  }
};

export const showListing = async (req, res, next) => {
  try {
    const listing = await listingModel.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found !"));
    res.status(200).json({ message: listing });
  } catch (error) {
    next(error);
  }
};

export const showUserListings = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(errorHandler(403, "You can have only your account's listings"));
  }

  try {
    const userRef = req.params.id;
    const userListings = await listingModel.find({ userRef });
    if (!userListings)
      return next(errorHandler(404, "There is no listing in this account!"));
    res.status(200).json({ message: userListings });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const { listingId, userId } = req.params;

  if (userId !== req.user.id) {
    return next(errorHandler(403, "You can have only your account's listings"));
  }

  try {
    const deletedListing = await listingModel.findById(listingId);
    if (!deletedListing)
      return next(errorHandler(404, "Bu Listing Zaten Silinmiş"));

    for (const file of deletedListing.files) {
      try {
        const deleted = await bucket.file(file.public_path).delete();
      } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).send("File deletion failed.");
      }
    }

    await listingModel.findByIdAndDelete(listingId);

    res.status(200).json({ message: listingId });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listingId = req.body._id;
  const userId = req.body.userRef;

  if (userId !== req.user.id) {
    return next(errorHandler(403, "You can have only your account's listings"));
  }

  try {
    const updatedListing = await listingModel.findById(listingId);
    if (!updatedListing)
      return next(errorHandler(404, "Böyle bir listing yok"));

    for (const file of updatedListing.files) {
      try {
        const deleted = await bucket.file(file.public_path).delete();
      } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).send("File deletion failed.");
      }
    }

    const fileDataArray = [];

    for (const file of req.files) {
      const storageFilePath = "" + file.originalname + new Date(Date.now());
      const fileUpload = bucket.file(storageFilePath);

      const result = await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      const downloadUrl = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });

      fileDataArray.push({ public_path: storageFilePath, url: downloadUrl[0] });
    }

    const updatedListing1 = await listingModel.findByIdAndUpdate(
      listingId,
      {
        $set: {
          name: req.body.name || undefined,
          description: req.body.description || undefined,
          address: req.body.address || undefined,
          type: req.body.type || undefined,
          bedrooms: req.body.bedrooms || undefined,
          baths: req.body.baths || undefined,
          regularPrice: req.body.regularPrice || undefined,
          discountPrice: req.body.discountPrice || undefined,
          offer: req.body.offer || undefined,
          parking: req.body.parking || undefined,
          furnished: req.body.furnished || undefined,
          files: fileDataArray || undefined,
          userRef: req.body.userRef || undefined,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: updatedListing1 });
  } catch (error) {
    next(error);
  }
};

export const searchListing = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let type = req.query.type;
    let parking = req.query.parking;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const searchedListings = await listingModel
      .find({
        name: {
          $regex: searchTerm,
          $options: "i",
        },
        offer,
        furnished,
        type,
        parking,
        // offer: offer || { $in: [false, true] },
        // furnished: furnished || { $in: [false, true] },
        // type:
        //   type === undefined || type === "all"
        //     ? { $in: ["rent", "sale"] }
        //     : type,
        // parking: parking || { $in: [false, true] },
      })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      message: searchedListings,
    });
  } catch (error) {
    next(error);
  }
};
