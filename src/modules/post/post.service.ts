import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  IcreatePostPayload,
  IpostQueryParams,
  IupdatePostPayload,
} from "./post.interface";

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

const GetAllPostsIntoDB = async (query: IpostQueryParams) => {
  const limit = query.limit ? Number(query.limit) : 5;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const result = await prisma.post.findMany({
    where: {
      AND: [
        //  title
        query.title ? { title: query.title } : {},
        //  content
        query.content ? { content: query.content } : {},

        // searchTerm
        query.searchTerm
          ? {
              OR: [
                {
                  title: {
                    contains: query.searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  content: {
                    contains: query.searchTerm,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
      ],
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
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
    },
  });

  return result;
};

const getPostByIdIntoDB = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

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
const getPostByIdTransIntoDB = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

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
  });

  return transactionResult;
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

      _count: {
        //total comments count for each post
        select: {
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const updatePostIntoDB = async (
  payload: IupdatePostPayload,
  postId: string,
  userId: string,
  userRole: string,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // Check if the user is the author of the post or an admin
  if (post.authorId !== userId && userRole !== "ADMIN") {
    throw new Error("You are not authorized to update this post");
  }

  const UpdatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...payload,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return UpdatedPost;
};

const deletePostIntoDB = async (
  postId: string,
  userId: string,
  userRole: string,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // Check if the user is the author of the post or an admin
  if (post.authorId !== userId && userRole !== "ADMIN") {
    throw new Error("You are not authorized to delete this post");
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getPostsStatsIntoDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPost = await tx.post.count();

    // const totalPuslishedPost = await tx.post.count({
    //      where:{
    //           status: PostStatus.PUBLISHED
    //      }
    // })

    // const totalDraftPost = await tx.post.count({
    //      where:{
    //           status: PostStatus.DRAFT
    //      }
    // })

    // const totalArchivedPost = await tx.post.count({
    //      where:{
    //           status: PostStatus.ARCHIVED
    //      }
    // })

    // const totalComments = await tx.comment.count()

    // const TotalApprovedComments = await tx.comment.count({
    //    where :{
    //        status:CommentStatus.APPROVED
    //    }
    // })

    // const TotalRejectedComments = await tx.comment.count({
    //    where :{
    //        status:CommentStatus.REJECTED
    //    }
    // })

    // const TotalPostViewsAggregate = await tx.post.aggregate({
    //    _sum : {
    //       views:true
    //    }
    // })

    // const TotalPostViews = TotalPostViewsAggregate._sum.views

    // return {
    //    totalPost,
    //    totalPuslishedPost,
    //    totalDraftPost,
    //    TotalRejectedComments,
    //    TotalApprovedComments,
    //    totalComments,
    //    totalArchivedPost,
    //    TotalPostViews
    // }

    const [
      totalPost,
      totalPuslishedPost,
      totalDraftPost,
      TotalRejectedComments,
      TotalApprovedComments,
      totalComments,
      totalArchivedPost,
      TotalPostViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPost,
      totalPuslishedPost,
      totalDraftPost,
      TotalRejectedComments,
      TotalApprovedComments,
      totalComments,
      totalArchivedPost,
      TotalPostViews: TotalPostViews._sum.views,
    };
  });

  return transactionResult;
};

export const postService = {
  createPostIntoDB,
  GetAllPostsIntoDB,
  getPostByIdIntoDB,
  updatePostIntoDB,
  deletePostIntoDB,
  getPostsStatsIntoDB,
  getMyPostsIntoDB,
  getPostByIdTransIntoDB,
};
