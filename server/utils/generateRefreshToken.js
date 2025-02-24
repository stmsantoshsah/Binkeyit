import jwt from 'jsonwebtoken';
import UserModel from "../models/user.model.js";

const generateRefreshToken = async (userId) => { 
    console.log("Generating refresh token for user:", userId);
    console.log("SECRET_KEY_REFRESH_TOKEN:", process.env.SECRET_KEY_REFRESH_TOKEN);

    if (!process.env.SECRET_KEY_REFRESH_TOKEN) {
        throw new Error("SECRET_KEY_REFRESH_TOKEN is missing in .env file");
    }

    const token = jwt.sign(
        { id: userId }, 
        process.env.SECRET_KEY_REFRESH_TOKEN, 
        { expiresIn: '7d' }
    );

    console.log("Generated refresh token:", token);

    await UserModel.updateOne(
        { _id: userId }, 
        { refresh_token: token }
    );

    return token;
};

export default generateRefreshToken;
