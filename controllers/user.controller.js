import { Resend } from "resend";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import jwt from "jsonwebtoken";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generateRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

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
      return res.status(409).send({
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

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Email is not found or user not register yet",
        success: false,
        error: true,
        data: null,
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(400).send({
        status: false,
        message: "Contact to Admin",
        success: false,
        error: true,
      });
    }

    const verifyPassword = await bcrypt.compareSync(password, user.password);

    if (!verifyPassword) {
      return res.status(400).send({
        status: false,
        message: "Password is not matched",
        success: false,
        error: true,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(
      user?._id,
      {
        last_login_date: new Date(),
      },
      {
        new: true,
      }
    );

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);

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

//GET LOGIN USERDETAILS

export const getUserDetailsController = async (req, res) => {
  try {
    const userId = req.userId;

    console.log(userId, "userid");

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    return res.status(200).send({
      status: true,
      message: "User details get successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("user-details", error);
    return res.status(500).send({
      status: false,
      message: "Something is wrong",
      error: true,
      success: false,
    });
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
    const userId = req?.userId; //auth middleware
    const image = req?.file; //multer middleware

    if (!image) {
      return res.status(400).send({ message: "No file uploaded", error: true });
    }

    const upload = await uploadImageCloudinary(image);


    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        avatar: upload?.url,
      },
      { new: true }
    );

    return res.send({
      status: true,
      message: "Upload profile successfully",
      success: true,
      avatar: upload,
      error: false,
      data: {
        _id: userId,
        avatar: upload?.url,
      },
    });
  } catch (error) {
    console.log("user-upload-error", error);
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
    const userId = req?.userId;
    const { name, email, mobile, password } = req?.body;

    let hashPassword = "";

    if (password) {
      hashPassword = bcrypt.hashSync(password, 10);
    }

    // if (!name || !email || !mobile || !password) {
    //   return res.send({
    //     status: false,
    //     message: "All fields are required",
    //     success: false,
    //     error: true,
    //   });
    // }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      },
      { new: true }
    );

    return res.send({
      status: true,
      message: "Updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//FORGET PASSWORD NOT LOGIN

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req?.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    const otp = generatedOtp();

    const expireTime = new Date() + 60 * 60 * 1000;

    const update = await UserModel.findByIdAndUpdate(
      user._id,
      {
        forgot_password_otp: otp,
        forgot_password_expiry: new Date(expireTime).toISOString(),
      },
      { new: true }
    );

    await sendEmail({
      to: email,
      subject: "Forgot password from Blinkit",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.send({
      status: true,
      message: "Check your email",
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//VERIFY FORGOT PASSWORD OTP

export const verifyForgotPasswordOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({
        status: false,
        message: "Provide requied field otp, email",
        success: false,
        error: true,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.send({
        status: false,
        message: "Email not available",
        success: false,
        error: true,
      });
    }

    const currentTime = new Date().toISOString();

    //IF OTP EXPIRED BESIDES OF CURRENT-TIME
    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).send({
        status: false,
        message: "OTP Expired",
        error: true,
        success: false,
      });
    }

    //IF OTP CAN NOT MATCH BY THE GMAIL OTP
    if (otp !== user.forgot_password_otp) {
      return res.status(400).send({
        status: false,
        message: "Invalid OTP please filed the correct OTP",
        error: true,
        success: false,
      });
    }

    //IF OTP IS NOT EXPIRED AND OTP == USER.FORGOT_PASSWORD_OTP

    const updateUser = await UserModel.findByIdAndUpdate(
      user?._id,
      { forgot_password_otp: "", forgot_password_expiry: "" },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "Verify OTP Successfully",
      success: true,
      error: false,
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      error: error.message || error,
      success: false,
    });
  }
};

//RESET PASSWORD

export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).send({
        status: false,
        message: "Provide required field email, new password, confirm-password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Email is not available",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send({
        status: false,
        mesage: "New password & confirmPassword must be same",
        error: true,
        success: false,
      });
    }

    const hashPassword = await bcrypt.hashSync(newPassword, 10);

    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        password: hashPassword,
      },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "Password updated successfully",
      sucess: true,
      error: false,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//REFRESH TOKEN CONTROLLER

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req?.cookies?.refreshToken
    if (!refreshToken) {
      return res.status(401).send({
        status: false,
        message: "No refresh token provided",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );

   
    const userId = verifyToken?.id;

    const newAccessToken = await generatedAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.cookie("accessToken", newAccessToken, cookiesOption);

    return res.status(200).send({
      status: true,
      message: "New access token generated",
      error: false,
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
    return res.status(401).send({
      status: false,
      message: "Token expired",
      error: true,
      success: false
    });
  }
  return res.status(401).send({
    status: false,
    message: "Invalid token",
    error: true,
    success: false
  })
}
};
