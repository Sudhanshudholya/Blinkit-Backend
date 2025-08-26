import {Router} from "express"
import { loginUserController, logOutUserController, registerUserController, updateUserDetailsController, uploadUserAvatarController, verifyEmailController } from "../controllers/user.controller.js"
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js"

const userRouter = Router()

userRouter.post("/register", registerUserController)
userRouter.post("/verify-email", verifyEmailController)
userRouter.post("/login", loginUserController)
userRouter.get("/logout", auth, logOutUserController)
userRouter.put("/upload-avatar", auth, upload.single('avatar'), uploadUserAvatarController)
userRouter.put("/update-user", auth, updateUserDetailsController)

export default userRouter