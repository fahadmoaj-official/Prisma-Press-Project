import type { Request, Response } from "express";

const CreatePost = async (req: Request, res: Response) => {};
const getAllPosts = async (req: Request, res: Response) => {};
const getPostById = async (req: Request, res: Response) => {};
const updatePost = async (req: Request, res: Response) => {};
const deletePost = async (req: Request, res: Response) => {};
const getPostsStats = async (req: Request, res: Response) => {};
const getMyPosts  = async (req: Request, res: Response) => {};

export const postController = {
    CreatePost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsStats,
    getMyPosts
};
