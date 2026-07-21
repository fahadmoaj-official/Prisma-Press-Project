import type { NextFunction, Request, Response } from "express";
import { SubscriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const SubcriptionGuard = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;


      const subscription = await prisma.subscription.findUnique({
        where: {
          userId,
        },
      });

      if (!subscription) {
        return next(new Error("You are not subscribed to premium content"));
      }

      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        return next(
          new Error("Please subscribe again to get access to Premium Contents"),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};