import {Router} from "express";
const router = Router();
import { AuthController } from "./auth.controller";


router.post("/login", AuthController.LoginUser);



export default router;