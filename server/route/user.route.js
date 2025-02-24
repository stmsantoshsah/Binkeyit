import { Router } from "express";
import { forgotPasswordController, loginController, logoutController, registerUserController, updateUserDetails, uploadAvtar, verifyEmailController } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router()
userRouter.post("/register",registerUserController)
userRouter.post("/verify-email",verifyEmailController)
userRouter.post("/login",loginController)
userRouter.get("/logout",auth,logoutController)
userRouter.put("/upload-avtar",auth,upload.single('avtar'),uploadAvtar)
userRouter.put("/update-user",auth,updateUserDetails)
userRouter.put("/forgot-password",forgotPasswordController)
export default userRouter