import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import env from "../../config/env";
import { RegisterUserPayload } from "./user.interface";

const RegisterUserIntoDb = async (payload: RegisterUserPayload) => {
    const {name, email, password, profilePhoto, bio, role} = payload;

     const isUserExist = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if(isUserExist) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password,Number(env.bcryptSaltRounds));

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            role: role || "USER",
            profile : {
                create: {
                    profilePhoto: profilePhoto,
                    bio: bio
                }
            }
        }
    });


    // await prisma.profile.create({
    //     data: {
    //         userId: user.id,
    //         profilePhoto: profilePhoto,
    //         bio: bio
    //     }
    // });

    const CreatedProfile = await prisma.user.findUnique({
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

    return CreatedProfile;
}


const GetMyProfileFromDb = async (userId: string) => {

       const profile = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        omit:{
            password: true,
        },
        include: {
            profile: true,
        }
    });

    if(!profile) {
        throw new Error("User not found");
    }

    return profile;
}


const updateMyProfileIntoDb = async ( userId: string,payload:RegisterUserPayload) =>{

     const {name, email,profilePhoto, bio} = payload;

     const isUserExist = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if(!isUserExist) {
        throw new Error("User not found");
    }

    const UpdateProfile =  await prisma.user.update({
        where: {
            id:userId
        },
        data: {
            name,
            email,
            profile :{
                update:{
                    profilePhoto,
                    bio
                }
            },
        },
        omit:{
            password:true
        },
        include:{
            profile:true
        }


        });

        return UpdateProfile

}



export const userService = {
    RegisterUserIntoDb,
    GetMyProfileFromDb,
    updateMyProfileIntoDb
}