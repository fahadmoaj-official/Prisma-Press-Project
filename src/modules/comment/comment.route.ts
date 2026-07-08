import { Router } from "express";
import { commentController } from "./comment.controller";
import isAuthenticated from "../../middleware/isAuthinticated";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


// public
router.get("/author/:authorId", commentController.getCommentsByAuthor); 
router.get("/:commentId", commentController.getCommentsById); 



router.post("/",isAuthenticated(Role.ADMIN, Role.USER,Role.AUTHOR), commentController.CreateComment);
router.patch("/:commentId", isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.UpdateComment);

router.delete("/:commentId", isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.DeleteComment);

router.patch("/:commentId/moderate", isAuthenticated(Role.ADMIN), commentController.ModarateComment);

export default router;
