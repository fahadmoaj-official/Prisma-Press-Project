import { prisma } from "../../lib/prisma";
import { IcreatePostPayload } from "./post.interface";

const createPostIntoDB = async (
  payload: IcreatePostPayload,
  userId: string,
) => {
  if (!userId) {
    throw new Error("Author id is required to create a post");
  }

  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const GetAllPostsIntoDB = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true, // FOR GOOD PRACTICE
          createdAt: true, // AS MY WISH
          updatedAt: true, // AS MY WISH
        },
      },
      comments: true,
    },
  });

  return result;
};

const getPostByIdIntoDB = async (postId: string) => {
  console.log("postId", postId);
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  //   increment the views count by 1
  const updatedResult = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: { increment: 1 },
    },
    include: {
      author: {
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      comments: true,
    },
  });

  return updatedResult;
};

const getMyPostsIntoDB = async (userId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      author: {
        omit: {
          password: true, // FOR GOOD PRACTICE
          createdAt: true, // AS MY WISH
          updatedAt: true, // AS MY WISH
        },
      },
      comments: true,

      _count: {   //total comments count for each post
        select: {
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const updatePostIntoDB = async (postData: any) => {};

const deletePostIntoDB = async (postData: any) => {};
const getPostsStatsIntoDB = async (postData: any) => {};

export const postService = {
  createPostIntoDB,
  GetAllPostsIntoDB,
  getPostByIdIntoDB,
  updatePostIntoDB,
  deletePostIntoDB,
  getPostsStatsIntoDB,
  getMyPostsIntoDB,
};
