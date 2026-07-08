import type { Request, Response } from "express";
import { postService } from "./post.service";
import sendResponse from "../../utils/sendResponse";

const CreatePost = async (req: Request, res: Response) => {
   
     try {
        const userId = req.user?.id;

        if (!userId) {
            throw new Error("Unauthorized: user not found in request");
        }

        const result = await postService.createPostIntoDB(req.body, userId);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Post created successfully",
            data: result
        })
        
    } catch (error) {
        
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to create post",
            error: error instanceof Error ? error.message : "Unknown error"
        })



     }
      

};




const getAllPosts = async (req: Request, res: Response) => {
     try {
        const result = await postService.GetAllPostsIntoDB();

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Posts retrieved successfully",
            data: result
        })
        
    } catch (error) {
        
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to retrieve posts",
            error: error instanceof Error ? error.message : "Unknown error"
        })



     }
};



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
