import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadimageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken"

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide name, email, and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return response.json({
                message: "Already registered email",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashPassword
        };

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

        await sendEmail({
            sendTo: email,
            subject: "Verify your email - Binkeyit",
            html: verifyEmailTemplate(name, verifyEmailUrl)
        });

        return response.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: save
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body;
        const user = await UserModel.findOne({ _id: code });

        if (!user) {
            return response.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false
            });
        }

        await UserModel.updateOne({ _id: code }, { verify_email: true });

        return response.json({
            message: "Email verification successful",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function loginController(request, response) {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            });
        }

        if (user.status !== 'Active') {
            return response.status(400).json({
                message: "Contact admin",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Incorrect password",
                error: true,
                success: false
            });
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);

        return response.json({
            message: "Login successful",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export async function logoutController(request, response) {
    try {
        const userid = request.userId //middleware
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        response.clearCookie("accessToken", cookieOptions)
        response.clearCookie("refreshToken", cookieOptions)
        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        })
        return response.json({
            message: "Logout Successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function uploadAvtar(request, response) {
    try {
        const userId = request.userId//auth middleware
        const image = request.file//multer middleware
        const upload = await uploadImageCloudinary(image)
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })
        return response.json({
            message: "upload profile",
            data: {
                _id: userId,
                avatar: upload.url
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId //auth middleware

        const { name, email, mobile, password } = request.body;
        let hashPassword = ""
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword }),
        })
        return response.json({
            message: "Updated User successfully",
            error: false,
            success: true,
            data: updateUser
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        const otp = generateOtp();
        const expireTime = new Date().getTime() + 60 * 60 * 1000;

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime)
        });

        await sendEmail({
            sendTo: email,
            subject: "Forgot Password from Binkeyit",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        });

        return response.json({
            message: "Check your email",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body
        if (!email || !otp) {
            return response.status(400).join({
                message: "Provide required field email otp.",
                error: true,
                message: false
            })
        }
        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        const currentTime = new Date()

        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: "Otp Is expired!",
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid otp",
                error: true,
                success: false
            })
        }
        return response.json({
            message: "Verify otp successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function resetPassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide require field email ,newPassword & confirmPassword",
                // error: true,
                // success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email is not Available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "newPassword & confirmPassword are not same.",
                error: true,
                success: false
            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)
        const update = await UserModel.findByIdAndUpdate(user._id, {
            password: hashPassword
        })
        return response.json({
            message: "Password updated successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.header?.authorization?.split(" ")[1]

        if (!refreshToken) {
            return response.status(400).json({
                message: "Invalid Token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id
        const newAccessToken = await generateAccessToken(userId)
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };
        response.cookie("accessToken", newAccessToken, cookieOptions)

        return response.json({
            message: "New access token generated",
            error: false,
            success: true,
            data: {
                accessToken:newAccessToken
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}