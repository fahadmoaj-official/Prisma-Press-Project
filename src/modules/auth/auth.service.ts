import type { Request, Response } from "express";
import { LoginUserData } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../utils/Token";

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



export const AuthService = {
    LoginUserIntoDb
}