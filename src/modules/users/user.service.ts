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
        }
    });


    await prisma.profile.create({
        data: {
            userId: user.id,
            profilePhoto: profilePhoto,
            bio: bio
        }
    });

    const profile = await prisma.user.findUnique({
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

    return profile;
}


export const userService = {
    RegisterUserIntoDb
}