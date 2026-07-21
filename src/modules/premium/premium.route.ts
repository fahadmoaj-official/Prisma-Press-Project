import { Router } from "express";
import isAuthenticated from "../../middleware/isAuthinticated";
import { Role } from "../../../generated/prisma/client";
import { premiumController } from "./premium.controller";
import { SubcriptionGuard } from "../../middleware/premiumGuard";
const router = Router();

router.get("/", isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),
SubcriptionGuard(),
premiumController.getPremiumContent
);


export default router;