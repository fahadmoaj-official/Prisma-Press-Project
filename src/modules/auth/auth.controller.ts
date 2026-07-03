import type { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse  from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { generateAccessToken, generateRefreshToken } from "../../utils/Token";


const LoginUser = async (req: Request, res: Response) => {
   try {

       const user = await AuthService.LoginUserIntoDb(req.body);

    //   const accessToken = generateAccessToken(req.body);
    //   const refreshToken = generateRefreshToken(req.body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged in successfully",
            data: { 
                    user, 
                    // accessToken: user.accessToken,
                    // refreshToken: user.refreshToken
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