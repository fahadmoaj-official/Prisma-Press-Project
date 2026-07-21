import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { commentService } from "./comment.service";

const CreateComment = async (req: Request, res: Response) => {
    
      try {
        const authorId = req.user?.id;

         console.log("author id",authorId);

        const result = await commentService.CreateCommentIntoDb(authorId as string, req.body);

        sendResponse(res, {
          statusCode: 201,
          success: true,
          message: "Comment created successfully",
          data: result,
        });



        
      } catch (error) {
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Failed to create comment",
          error: error instanceof Error ? error.message : "Internal Server Error",
        });
      }
    
};


const getCommentsByAuthor = async (req: Request, res: Response) => {
      try {
           
        const authorId = req.params.authorId;

        const result = await commentService.getCommentsByAuthorIntoDb(authorId as string);

        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Comments retrieved successfully",
          data: result,
        });
        
      } catch (error) {
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Failed to retrieve comments",
          error: error instanceof Error ? error.message : "Internal Server Error",
        });
      }
    
};

const getCommentsByPostId = async (req: Request, res: Response) => {
    try {
        
        const  postId  = req.params.postId;
        
        const result = await commentService.getCommentsByPostIdIntoDb(postId as string);

        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Comments retrieved successfully",
          data: result,
        });
        
      } catch (error) {
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Failed to retrieve comments",
          error: error instanceof Error ? error.message : "Internal Server Error",
        });
      }
    
};


const UpdateComment = async (req: Request, res: Response) => {
   try {
        
        const commentId  = req.params.commentId;
        const authorId = req.user?.id;
        const role = req.user?.role;

        const result = await commentService.UpdateCommentIntoDb(commentId as string,authorId as string, role as string, req.body);

        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Comments updated successfully",
          data: result,
        });
        
      } catch (error) {
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Failed to update comments",
          error: error instanceof Error ? error.message : "Internal Server Error",
        });
      }
    
    
};



const DeleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
     const authorId = req.user?.id;
    const role = req.user?.role;

    try {
        await commentService.DeleteCommentIntoDb(commentId as string, authorId as string, role as string);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to delete comment",
            error: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

const ModarateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        const result = await commentService.ModarateCommentIntoDb(commentId as string, req.body.status);
         sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Comment moderated successfully",
            data: result
        });
        
    } catch (error) {
         sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to moderate comment",
            error: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
    
};




export const commentController = {
    getCommentsByAuthor,
    getCommentsByPostId,
    CreateComment,
    UpdateComment,
    DeleteComment,
    ModarateComment
};