import { prisma } from "../../lib/prisma"
import { IcreatePostPayload } from "./post.interface"


const createPostIntoDB = async (payload: IcreatePostPayload,userId: string) => {
     if (!userId) {
        throw new Error("Author id is required to create a post");
     }

   //   if (!payload.title || !payload.content || !Array.isArray(payload.tags)) {
   //      throw new Error("title, content, and tags are required to create a post");
   //   }

        const result = await prisma.post.create({
              data: {
                ...payload,
                authorId : userId
              }
        })

        return result;
}



const GetAllPostsIntoDB = async () => {
     const result = await prisma.post.findMany(
      {
         include:{
            author:true,
            comments:true
         }
      }
     );

        return result;


}

const getPostByIdIntoDB = async (postData: any) => {}
const updatePostIntoDB = async (postData: any) => {}

const deletePostIntoDB = async (postData: any) => {}
const getPostsStatsIntoDB = async (postData: any) => {}

const getMyPostsIntoDB = async (postData: any) => {}

export const postService = {
  createPostIntoDB,
  GetAllPostsIntoDB,
    getPostByIdIntoDB,
    updatePostIntoDB,
    deletePostIntoDB,
    getPostsStatsIntoDB,
    getMyPostsIntoDB
};

