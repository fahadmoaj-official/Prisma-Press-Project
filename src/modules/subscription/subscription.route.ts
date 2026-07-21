import { Router } from "express";
import express from "express";
import { Role } from "../../../generated/prisma/enums";
import isAuthenticated from "../../middleware/isAuthinticated";
import { subscriptionController } from "./subscription.controller";
const router = Router();

router.post(
  "/checkout",
  isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),
  subscriptionController.createCheckoutSession,
);

router.post("/webhook",
   subscriptionController.handleStripeWebhook);

export default router;
