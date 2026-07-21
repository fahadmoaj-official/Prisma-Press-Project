import { prisma } from "../../lib/prisma";
import { IpostQueryParams } from "../post/post.interface";

const getPremiumContentIntoDb = async (query: IpostQueryParams) => {
  const limit = query.limit ? Number(query.limit) : 5;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const result = await prisma.post.findMany({
    where: {
      isPremium: true,
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

  return {
    data : result,
    meta :{
      page,
      limit,
      total : result.length,
      totalPages : Math.ceil(result.length / limit),
    }
  };
};

export const premiumService = {
  getPremiumContentIntoDb,
};
