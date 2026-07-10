import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface IcreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured: boolean;
  status?: PostStatus;
  tags: string[];
}

export interface IupdatePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags?: string[];
}


export interface IpostQueryParams extends PostWhereInput{
  // title?: string;
  // content?: string;

  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  searchTerm?: string;
 
}