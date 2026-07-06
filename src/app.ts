import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import env from "./config/env";
import cors from "cors";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.route";
import commentRoutes from "./modules/comment/comment.route";
import postRoutes from "./modules/post/post.route";
const app = express();



app.use(cors({
    origin: env.APP_URL,
    credentials: true,
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req:Request, res:Response) => {
    res.send("Hello, World!");
});


app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/comments",commentRoutes);







export default app;
