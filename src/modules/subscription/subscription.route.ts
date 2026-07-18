import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import isAuthenticated from "../../middleware/isAuthinticated";
import { Role } from "../../../generated/prisma/enums";
const router = Router();


router.post("/checkout", 
    isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),
    subscriptionController.createCheckoutSession)




export default router;