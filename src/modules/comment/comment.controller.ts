import type { Request, Response } from "express";

const getCommentsByAuthor = async (req: Request, res: Response) => {
    const { authorId } = req.params;
    
};
const getCommentsById = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    
};
const CreateComment = async (req: Request, res: Response) => {
    const { authorId } = req.params;
    
};
const UpdateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    
};
const DeleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    
};

const ModarateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    
};




export const commentController = {
    getCommentsByAuthor,
    getCommentsById,
    CreateComment,
    UpdateComment,
    DeleteComment,
    ModarateComment
};