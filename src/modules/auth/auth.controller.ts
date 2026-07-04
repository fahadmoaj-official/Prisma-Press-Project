import type { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse  from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { generateAccessToken, generateRefreshToken } from "../../utils/Token";
import  env  from "../../config/env";

const LoginUser = async (req: Request, res: Response) => {
   try {

       const {accessToken, refreshToken,UserExist} = await AuthService.LoginUserIntoDb(req.body);



       res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        maxAge:  1 * 24 * 60 * 60 * 1000, // 1 days in milliseconds
       });

       res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        maxAge:  5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
       });



        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged in successfully",
            data: { 
                    user: UserExist,
                    accessToken,
                    refreshToken
            },
            
        });


   } catch (error) {

          sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal server error while Login user",
            error: error instanceof Error ? error.message : "Unknown error"
        });

   }
}


export const AuthController = {
    LoginUser
}