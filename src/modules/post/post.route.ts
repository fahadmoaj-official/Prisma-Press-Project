import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import isAuthenticated from "../../middleware/isAuthinticated";
import { postController } from "./post.controller";

const router = Router();

router.get(
  "/",
  isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.getAllPosts,
); //✅

router.get("/stats", isAuthenticated(Role.ADMIN), postController.getPostsStats);

router.get(
  "/my-posts",
  isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.getMyPosts, //✅
);

router.get("/:postId", postController.getPostById); //✅

router.post(
  "/",
  isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.CreatePost,
); //✅

router.patch(
  "/:postId",
  isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.updatePost,
); //✅

router.delete(
  "/:postId",
  isAuthenticated(Role.ADMIN, Role.USER, Role.AUTHOR),
  postController.deletePost,
); //✅

export default router;
