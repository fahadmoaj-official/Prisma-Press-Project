import { CommentStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  ICreateCommentPayload,
  IUpdateCommentPayload,
  IModarateCommentPayload,
} from "./comment.interface";

const CreateCommentIntoDb = async (
  authorId: string,
  payload: ICreateCommentPayload,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: payload.postId,
    }
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const comment = await prisma.comment.create({
    data: {
      ...payload,
      authorId: authorId,
    },
  });

  return comment;
};

const getCommentsByAuthorIntoDb = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      }
    },
  });

  if (!comments || comments.length === 0) {
    throw new Error("No comments found for the given author");
  }

  return comments;
};

const getCommentsByIdIntoDb = async (commentId: string) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },include:{
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      }
    }
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  return comment;
};

const UpdateCommentIntoDb = async (
  commentId: string,
  authorId: string,
  role: string,
  payload: IUpdateCommentPayload,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.authorId !== authorId && role !== "ADMIN") {
    throw new Error("You are not authorized to update this comment");
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      ...payload,
    },
  });

  return updatedComment;
};

const DeleteCommentIntoDb = async (
  commentId: string,
  authorId: string,
  role: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.authorId !== authorId && role !== "ADMIN") {
    throw new Error("You are not authorized to delete this comment");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};
const ModarateCommentIntoDb = async (commentId: string, status: IModarateCommentPayload) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select:{
      id:true, 
      status:true
    }
  });

  if (!comment) {
    throw new Error("Comment not found");
  }


   const updateModarteComment = await prisma.comment.update({
      where:{
         id:commentId
      },
      data:{
          status: status.status as CommentStatus
      }
   })

  

  return updateModarteComment; ;
};

export const commentService = {
  getCommentsByAuthorIntoDb,
  getCommentsByIdIntoDb,
  CreateCommentIntoDb,
  UpdateCommentIntoDb,
  DeleteCommentIntoDb,
  ModarateCommentIntoDb,
};
