import { Resend } from "resend";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import jwt from "jsonwebtoken";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generateRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

//REGISTER USER CONTROLLER
export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        status: false,
        message: "Provide name, email, password",
        success: false,
        error: true,
        data: null,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.send({
        status: false,
        message: "Email already exists",
        success: false,
        error: true,
        data: null,
      });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    // const payload = {name, email, password: hashPassword}

    // const newUser = new UserModel(payload)
    // const create = await newUser.create()

    const register = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${register?._id}`;

    const verifyEmail = await sendEmail({
      to: email,
      subject: "Verify your email from Blinkit",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    if (!register) {
      return res.send({
        status: false,
        message: "Failed to register",
        success: false,
        error: true,
        data: null,
      });
    }

    return res.status(200).send({
      status: true,
      message: "User register successfully",
      error: false,
      success: true,
      data: register,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//VERIFY USER CONTROLLER
export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Invalid code",
        success: false,
        error: true,
        data: null,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.send({
      status: true,
      message: "Verify email done",
      success: true,
      error: false,
      data: updateUser,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//LOGIN USER CONTROLLER

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({
        status: false,
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const userEmail = await UserModel.findOne({ email });

    if (!userEmail) {
      return res.status(400).send({
        status: false,
        message: "Email is not found or user not register yet",
        success: false,
        error: true,
        data: null,
      });
    }

    if (userEmail.status !== "ACTIVE") {
      return res.status(400).send({
        status: false,
        message: "Contact to Admin",
        success: false,
        error: true,
      });
    }

    const verifyPassword = bcrypt.compareSync(password, userEmail.password);

    if (!verifyPassword) {
      return res.status(400).send({
        status: false,
        message: "Password is not match",
        success: false,
        error: true,
      });
    }

    const accessToken = await generatedAccessToken(userEmail._id);
    const refreshToken = await generateRefreshToken(userEmail._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.status(200).send({
      status: true,
      message: "User login successfully",
      success: true,
      error: false,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || error,
      error: true,
      success: false,
    });
    console.log(error, "error");
  }
};

//LOGOUT USER CONTROLLER

export const logOutUserController = async (req, res) => {
  try {
    const userId = req.userId;

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    return res.send({
      status: true,
      message: "Logout successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//UPLOAD USER AVTAR

export const uploadUserAvatarController = async (req, res) => {
  try {
    const userId = req.userId; //auth middleware
    const image = req.file; //multer middleware

    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        avatar: upload.url,
      },
      { new: true }
    );

    return res.send({
      status: true,
      message: "Upload profile successfully",
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || error,
      status: false,
      success: false,
      error: true,
    });
  }
};

//UPDATE USER DETAILS

export const updateUserDetailsController = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, mobile, password, } = req.body;
    let hashPassword = "";

    if (password) {
      hashPassword = bcrypt.hashSync(password, 10);
    }

    if (!name || !email || !mobile || !password ) {
      return res.send({
        status: false,
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(mobile && { mobile: mobile }),
      ...(password && { password: hashPassword }),
      
    },
  {new: true}
  );

    return res.send({
      status: true,
      message: "User updated successfully",
      error: false,
      success: true,
      data: updateUser
    })
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//FORGET PASSWORD
export const forgetApiPassword = async (req, res) => {
  try {
    const {email} = req.body

    const user = await UserModel.findOne({email})

    if(!user) {
      return res.send({
        status: false,
        message: "Email not available",
        error: true, 
        success: false
      })
    }

    
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || error,
      error: true,
      success: false
    })
  }
}