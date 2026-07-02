import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import env from "../../config/env";
import { userService } from "./user.service";


const RegisterUser = async (req: Request, res: Response) => {
try {

    const profile = await userService.RegisterUserIntoDb(req.body);

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
}



export const UserController = {
     RegisterUser
    
};