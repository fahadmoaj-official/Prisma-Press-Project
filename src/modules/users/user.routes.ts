import {Router} from "express";
const router = Router();
import { UserController } from "./user.controller";
import isAuthenticated from "../../middleware/isAuthinticated";
import { Role } from "../../../generated/prisma/enums";



router.post("/register", UserController.RegisterUser);

router.get("/me", isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),UserController.GetMyProfile);

router.put("/my-profile", isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),UserController.UpdateProfile);



export default router;