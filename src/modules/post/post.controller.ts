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


const getPostById = async (req: Request, res: Response) => {
      try {
         
          const postId = req.params.postId;
          if (!postId) {
            throw new Error("Post ID is required");
          }
        const result = await postService.getPostByIdIntoDB(postId as string);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Post retrieved successfully",
            data: result
        })
        
    } catch (error) {
        
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to retrieve GET POST BY ID",
            error: error instanceof Error ? error.message : "Unknown error"
        })



     }
};


const getPostByIdTrans = async (req: Request, res: Response) => {
      try {
         
          const postId = req.params.postId;
          if (!postId) {
            throw new Error("Post ID is required");
          }
        const result = await postService.getPostByIdTransIntoDB(postId as string);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Post retrieved successfully",
            data: result
        })
        
    } catch (error) {
        
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to retrieve GET POST BY ID",
            error: error instanceof Error ? error.message : "Unknown error"
        })



     }
};


const getMyPosts  = async (req: Request, res: Response) => {
       try {
         
          const userId = req.user?.id;
          
          
        const result = await postService.getMyPostsIntoDB(userId as string);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Post retrieved successfully",
            data: result
        })
        
    } catch (error) {
        
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to retrieve GET MY POSTS",
            error: error instanceof Error ? error.message : "Unknown error"
        })



     }
};



const updatePost = async (req: Request, res: Response) => {
       try {
         
        const postId = req.params.postId;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if(!postId ){
            throw new Error("Post ID is required");
        }
        const result = await postService.updatePostIntoDB(req.body, postId as string,userId as string,userRole as string);

       
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Post Update successfully",
            data: result
        })
        
    } catch (error) {
        
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to Update post",
            error: error instanceof Error ? error.message : "Unknown error"
        })



     }
};

const deletePost = async (req: Request, res: Response) => {
      try {
         
        const postId = req.params.postId;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if(!postId ){
            throw new Error("Post ID is required");
        }
        const result = await postService.deletePostIntoDB(postId as string,userId as string,userRole as string);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Post deleted successfully",
            
        })
        
    } catch (error) {
        
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to delete post",
            error: error instanceof Error ? error.message : "Unknown error"
        })



     }
};
const getPostsStats = async (req: Request, res: Response) => {
       try {
         
        const result = await postService.getPostsStatsIntoDB()

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Post Get successfully",
            data: result
            
        })
        
    } catch (error) {
        
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to Get Post Stats post",
            error: error instanceof Error ? error.message : "Unknown error"
        })



     }
};


export const postController = {
    CreatePost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsStats,
    getMyPosts,
    getPostByIdTrans
};
