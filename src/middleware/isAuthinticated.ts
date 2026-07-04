import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/Token";
import env from "../config/env";
import { ActiveStatus, Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const isAuthenticated =
  (...requiredRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      

      const token =
        req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error(
          "Access token is missing. Please log in to access this resource.",
        );
      }

      const decoded = verifyToken(token, env.ACCESS_TOKEN_SECRET);

      if (!decoded) {
        throw new Error("Invalid access token. Please log in again.");
      }

      if (!decoded.success) { // Check if the verification was unsuccessful check by verifyToken function
        throw new Error(decoded.message);
      }

      const { id, email, role, name } = decoded.data as JwtPayload;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return next(new Error("User not found."));
      }

      // 4. Check account status
      if (user.activeStatus === ActiveStatus.BLOCKED) {
        return next(new Error("Your account has been blocked."));
      }

      // 5. Authorization
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        return next(
          new Error("You are not authorized to access this resource."),
        );
      }

      // 6. Attach fresh user info from DB
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      return next(new Error("Invalid access token. Please log in again."));
    }
  };

export default isAuthenticated;
