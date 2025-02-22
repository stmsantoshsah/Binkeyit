import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from 'helmet';
import cors from 'cors'
import connectDB from "./config/connectDB.js";
const app = express();
dotenv.config();
app.use(cors({
    credential: true,
    origin: "process.env.FRONTEND_URL"
}))
app.use(express.json());
app.use(cookieParser());
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false,
}))
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("mongodb connected successfully")
    })
    .catch((error) => {
        console.log(error)
    })
app.get("/", (req, resp) => {
    resp.send("Mongodb Connected")
})

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port:${PORT}`)
    })
});
