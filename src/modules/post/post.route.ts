import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

router.get("/" ,postController.getAllPosts);
router.get("/stats", postController.getPostsStats);

router.get("/my-posts", postController.getMyPosts);
router.get("/:postId", postController.getPostById);

router.post("/", postController.CreatePost);
router.patch("/:postId", postController.updatePost);

router.delete("/:postId", postController.deletePost);

export default router;
