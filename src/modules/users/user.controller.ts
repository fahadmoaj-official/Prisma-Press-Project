import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import env from "../../config/env";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../utils/Token";

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

      

         const profile = await userService.GetMyProfileFromDb(req.user?.id as string);

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


const UpdateProfile = async (req: Request, res: Response) => {
    try {

      
        const result = await userService.updateMyProfileIntoDb(req.user?.id as string, req.body);

    

        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "User profile Update successfully",
            data: {
                result
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
     GetMyProfile,
     UpdateProfile
};