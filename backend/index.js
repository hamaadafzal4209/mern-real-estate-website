import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from 'path';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB)
    .then(() => {
        console.log("Connected To Database!");
    })
    .catch((err) => {
        console.log("Error: ", err);
    });

const __dirname = path.resolve();

app.use('/backend/user', userRouter);
app.use('/backend/auth', authRouter);
app.use('/backend/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index,html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});