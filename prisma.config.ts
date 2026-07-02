
import "dotenv/config";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/models",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
