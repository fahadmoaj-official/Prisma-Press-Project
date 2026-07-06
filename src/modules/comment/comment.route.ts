import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/author/:authorId", commentController.getCommentsByAuthor);
router.get("/:commentId", commentController.getCommentsById);

router.post("/", commentController.CreateComment);
router.patch("/:commentId", commentController.UpdateComment);

router.delete("/:commentId", commentController.DeleteComment);
router.patch("/:commentId/moderate", commentController.ModarateComment);

export default router;
