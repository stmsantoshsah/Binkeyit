import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from 'helmet';
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL, // Remove quotes
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
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

app.use("/api/user",userRouter)
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port:${PORT}`)
    })
});
