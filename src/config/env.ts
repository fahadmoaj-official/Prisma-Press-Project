import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_URL: process.env.APP_URL,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
};

export default env;