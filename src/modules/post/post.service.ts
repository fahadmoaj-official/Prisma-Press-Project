import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import { IcreatePostPayload,IupdatePostPayload } from "./post.interface";

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
 
    const transactionResult = await prisma.$transaction(
       async (tx) =>{
           const post = await tx.post.findUnique({

                  where: {
                    id: postId,
                 },
            })

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
       }
    )

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

const updatePostIntoDB = async (payload: IupdatePostPayload,postId: string,userId: string,userRole: string) => {
   
       const post = await prisma.post.findUnique({
            where:{
                  id: postId
            }
       })

       if(!post){
        throw new Error("Post not found");
       }

       // Check if the user is the author of the post or an admin
       if (post.authorId !== userId && userRole !== "ADMIN") {
        throw new Error("You are not authorized to update this post");
       }

       const UpdatedPost = await prisma.post.update({
        where:{
            id: postId
         },
         data: {
            ...payload
         },
         include:{
             author:{
                  omit:{
                     password:true, 
                  }
             },
             comments:true,
         }
       })

       return UpdatedPost;

};



const deletePostIntoDB = async (postId: string,userId: string,userRole: string) => {
    
         const post = await prisma.post.findUnique({
            where:{
                  id: postId
            }
         })

         if(!post){
          throw new Error("Post not found");
         }

         // Check if the user is the author of the post or an admin
         if (post.authorId !== userId && userRole !== "ADMIN") {
          throw new Error("You are not authorized to delete this post");
         }

         const deletedPost = await prisma.post.delete({
            where:{
                id: postId
             },
         })


};


const getPostsStatsIntoDB = async (postData: any) => {};

export const postService = {
  createPostIntoDB,
  GetAllPostsIntoDB,
  getPostByIdIntoDB,
  updatePostIntoDB,
  deletePostIntoDB,
  getPostsStatsIntoDB,
  getMyPostsIntoDB,
  getPostByIdTransIntoDB
};
