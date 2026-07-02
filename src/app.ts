import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import env from "./config/env";
import cors from "cors";
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





export default app;
