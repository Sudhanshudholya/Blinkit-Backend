import {Router} from "express"
import { forgotPasswordController, getUserDetailsController, loginUserController, logOutUserController, refreshTokenController, registerUserController, resetPasswordController, updateUserDetailsController, uploadUserAvatarController, verifyEmailController, verifyForgotPasswordOtpController } from "../controllers/user.controller.js"
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js"

const userRouter = Router()

userRouter.post("/register", registerUserController)
userRouter.post("/verify-email", verifyEmailController)
userRouter.post("/login", loginUserController)
userRouter.get('/user-details', auth, getUserDetailsController)
userRouter.post("/logout", auth, logOutUserController)
userRouter.put("/upload-avatar", auth, upload.single('avatar'), uploadUserAvatarController)
userRouter.put("/update-user", auth, updateUserDetailsController)
userRouter.put("/forgot-password", forgotPasswordController)
userRouter.put("/verify-forgot-password-otp", verifyForgotPasswordOtpController)
userRouter.put("/reset-password", resetPasswordController)
userRouter.post("/refresh-token", refreshTokenController)

export default userRouter