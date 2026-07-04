import {Router} from "express";
const router = Router();
import { UserController } from "./user.controller";


router.post("/register", UserController.RegisterUser);


router.get("/me", UserController.GetMyProfile);



export default router;