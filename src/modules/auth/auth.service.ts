import type { Request, Response } from "express";
import { LoginUserData } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/Token";
import env from "../../config/env";
import { error } from "node:console";
import { JwtPayload } from "jsonwebtoken";

const LoginUserIntoDb = async (payload: LoginUserData) => {  
   
     const { email, password } = payload;

     const UserExist = await prisma.user.findUnique({
        where: {
            email: email
        },
     })
   
     if(!UserExist){
        throw new Error("User not found");
     }

     const isPassowordMatched = await bcrypt.compare(password, UserExist.password);


     
     
     if(!isPassowordMatched){
        throw new Error("Password is incorrect : Invalid credentials");
     }

    const accessToken = generateAccessToken(UserExist);
    const refreshToken = generateRefreshToken(UserExist);

      // Remove password from the response
     const { password: _, ...userWithoutPassword } = UserExist;

    return { 
      UserExist : userWithoutPassword, 
      accessToken, 
      refreshToken };




}


const RefreshTokenIntoDb = async (refreshtoken:string) =>{
        const verifyRefreshToken = verifyToken(refreshtoken,env.REFRESH_TOKEN_SECRET)

        if(!verifyRefreshToken.success){
           throw new Error (verifyRefreshToken.message)
        }


        const {id} = verifyRefreshToken.data as JwtPayload;

        const user = await prisma.user.findUnique({
           where:{
             id
           }
        })

        if(!user){
          throw new Error("ReFresh Token Is not valid");
        }

        if(user.activeStatus === "BLOCKED"){
         throw new Error("User is Blocked");
        }


        const NewAccessToken = generateAccessToken(user);
    
        return {NewAccessToken};

}


export const AuthService = {
    LoginUserIntoDb,
    RefreshTokenIntoDb
}