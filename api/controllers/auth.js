import { authModel } from "../models/auth.js";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const emailExist = await authModel.findOne({ email });

    if (emailExist) {
      return next(errorHandler(409, "This email address is already exists"));
    }
    if (password.length < 6) {
      return next(
        errorHandler(422, "Unprocessable Entity, Password is lower than 6 cha")
      );
    }

    const encryptedPassword = bcryptjs.hashSync(password, 10);

    const newUser = await authModel.create({
      name,
      email,
      password: encryptedPassword,
    });

    res.status(200).json({
      message: "Başarılı bir şekilde kaydedildi",
      registeredUser: { name, email },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const validUser = await authModel.findOne({ email });

    if (!validUser) {
      return next(
        errorHandler(403, "There is no email in db related to this email ")
      );
    }

    const comparedPassword = bcryptjs.compareSync(
      password,
      validUser._doc.password
    );

    if (!comparedPassword) return next(errorHandler(401, "Password is wrong"));

    const accessToken = jwt.sign(
      { id: validUser._doc._id },
      process.env.SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    const cookieOptions = {
      httpOnly: false,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("id", validUser._doc._id, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("userAvatar", validUser._doc.avatar.url, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("userName", validUser._doc.name, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("userEmail", validUser._doc.email, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        message: "Başarılı bir şekilde giriş olundu",
        loggedInUser: {
          ...rest,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const oAuth = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;
    let validUser = await authModel.findOne({ email });

    if (!validUser) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      let validUser = await authModel.create({
        name:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email,
        password: hashedPassword,
        avatar: {
          url: photo,
        },
      });
    }

    const accessToken = jwt.sign(
      { id: validUser._id },
      process.env.SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("userAvatar", validUser.avatar.url, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("userName", validUser.name, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("userEmail", validUser.email, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .cookie("id", validUser.id, {
        httpOnly: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        message: "Başarılı bir şekilde giriş olundu",
        loggedInUser: {
          ...rest,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("userName");
    res.clearCookie("userEmail");
    res.clearCookie("userAvatar");
    res.clearCookie("id");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};
