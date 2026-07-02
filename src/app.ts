import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import env from "./config/env";
import cors from "cors";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
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


app.post("/api/auth/register", async (req:Request, res:Response) => {

try {

    const {name, email, password,profilePhoto,bio,role} = req.body;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if(isUserExist) {
        return res.status(httpStatus.CONFLICT).json({
            message: "User already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password,Number(env.bcryptSaltRounds));

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            role: role || "USER",
        }
    });


    await prisma.profile.create({
        data: {
            userId: user.id,
            profilePhoto: profilePhoto,
            bio: bio
        }
    });

    const profile = await prisma.user.findUnique({
        where: {
            id: user.id,
            email: user.email || email,
        },
        omit:{
            password: true,
        },
        include: {
            profile: true,
        }
    });



    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Data received successfully",
        data: {
            user: profile
        }
    });

    }catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal server error while registering user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }

    
})





export default app;
