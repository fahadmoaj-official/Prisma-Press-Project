import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import env from "../../config/env";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import { verifyAccesstoken } from "../../utils/Token";

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


const GetMyProfile = async (req: Request, res: Response) => {
    try {

        const {accessToken} = req.cookies;

      

       const VerifiedToken = verifyAccesstoken(accessToken, env.ACCESS_TOKEN_SECRET);

         const profile = await userService.GetMyProfileFromDb(VerifiedToken.id);

        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "User profile retrieved successfully",
            data: {
                user: profile
            }
       })





    }catch (error) {
            sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal server error while Retrive get my profile",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}


export const UserController = {
     RegisterUser,
     GetMyProfile
};