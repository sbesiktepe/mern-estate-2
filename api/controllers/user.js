import { errorHandler } from "../utils/errorHandler.js";
import { authModel } from "../models/auth.js";
import bcryptjs from "bcryptjs";
import { bucket } from "../utils/serviceAccount.js";

export const updateUser = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(
      errorHandler(403, "You can only make changes for your account")
    );
  }

  const file = req.file;

  if (file) {
    try {
      const storageFilePath = "" + file.originalname + new Date(Date.now()); // Specify the path in Firebase Storage
      const fileUpload = bucket.file(storageFilePath);

      console.log(storageFilePath);

      const result = await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      const downloadUrl = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });
      req.user.public_path = storageFilePath;
      req.user.url = downloadUrl;

      console.log("File uploaded to Firebase Storage successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).send("File upload failed.");
    }
  }

  if (!file) {
    req.user.url = null;
    req.user.public_path = null;
  }

  const encryptedPassword = req.body.password
    ? bcryptjs.hashSync(req.body.password, 10)
    : null;

  try {
    const updatedUser = await authModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          // ...(req.body.password && { password: encryptedPassword }),
          password: encryptedPassword || undefined,
          ...(req.user.url && {
            avatar: {
              public_path: req.user.public_path,
              url: req.user.url[0],
            },
          }),
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;
    // console.log(updatedUser);
    // console.log(updatedUser._doc);
    res
      .cookie("userAvatar", updatedUser.avatar.url, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("userName", updatedUser.name, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("userEmail", updatedUser.email, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        message: "Başarılı bir şekilde değişiklilik gerçekleştirildi",
        loggedInUser: {
          ...rest,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(errorHandler(403, "You can delete only your account"));
  }
  const deletedUser = await authModel.findById(req.user.id);
  const storageFilePath = deletedUser.avatar.public_path;
  try {
    const deleted = await bucket.file(storageFilePath).delete();
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).send("File deletion failed.");
  }
  try {
    await authModel.findByIdAndDelete(req.user.id);
    res.clearCookie("access_token");
    res.clearCookie("userName");
    res.clearCookie("userEmail");
    res.clearCookie("userAvatar");
    res.status(200).json("User Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await authModel.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found !"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
