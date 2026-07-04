import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import env from "../config/env";
import { Role } from '../../generated/prisma/client';


 interface AccessTokenPayload {
    id: string;
    name: string;
    email: string;
    role: Role;
}


export const generateAccessToken = (user: AccessTokenPayload) => {

    const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };


  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  }as SignOptions);
};



export const generateRefreshToken = (user: AccessTokenPayload) => {

   const payload = {
    id: user.id,
    name: user.name, 
    email: user.email,
    role: user.role,
  };


  return jwt.sign( payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  }as SignOptions);
};


export const verifyToken = (token: string, secret: string) => {
  

  try{
       const verifiedToken = jwt.verify(token, secret) as JwtPayload;
        return {
          success : true,
          data : verifiedToken
        };
  }catch(error) {
         return {
          success : false,
          message : error instanceof Error ? error.message : "Unknown error"
        
         }
  }

};