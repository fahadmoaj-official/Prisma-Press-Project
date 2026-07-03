import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import env from "../../config/env";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";


const RegisterUser = async (req: Request, res: Response) => {
try {

    const profile = await userService.RegisterUserIntoDb(req.body);

    //  Best Approch to send response to client
   sendResponse(res,{
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: {
            user: profile
        }
   })



    }catch (error) {
       
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal server error while registering user",
            error: error instanceof Error ? error.message : "Unknown error"
        });


    }
}



export const UserController = {
     RegisterUser
    
};