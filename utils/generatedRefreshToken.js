import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/user.model.js";
dotenv.config();

const generateRefreshToken = async (userId) => {
  const token = await jwt.sign(
    { id: userId },
    process.env.JWT_SECRET_REFRESH_TOKEN,
    { expiresIn: "30d" }
  );

  const updateRefreshTokenUser = await UserModel.updateOne(
  {
    _id: userId,
  },
 {
    refresh_token: token
 }
);

  return token;
};

export default generateRefreshToken;
