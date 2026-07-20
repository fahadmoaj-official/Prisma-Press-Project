import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import env from "./config/env";
import { stripe } from "./lib/stripe";
import { globalErrorHandler } from "./middleware/GlobalErrorHandler";
import { notFound } from "./middleware/NotFound";
import authRoutes from "./modules/auth/auth.route";
import commentRoutes from "./modules/comment/comment.route";
import postRoutes from "./modules/post/post.route";
import subscriptionRoutes from "./modules/subscription/subscription.route";
import userRoutes from "./modules/users/user.routes";
const app = express();



app.use(cors({
    origin: env.APP_URL,
    credentials: true,
}))


app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }))




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
app.use("/api/subscription", subscriptionRoutes);



app.use(notFound);
app.use(globalErrorHandler);



export default app;
