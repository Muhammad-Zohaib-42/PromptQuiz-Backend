import "dotenv/config"

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
}

if (!process.env.PORT) {
    throw new Error("PORT environment variable is not defined");
}

if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not defined");
}

if (!process.env.PERSONAL_EMAIL) {
    throw new Error("PERSONAL_EMAIL environment variable is not defined");
}

if (!process.env.PERSONAL_EMAIL_PASSWORD) {
    throw new Error("PERSONAL_EMAIL_PASSWORD environment variable is not defined");
}

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET environment variable is not defined");
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET environment variable is not defined");
}

if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV environment variable is not defined");
}

export const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PERSONAL_EMAIL: process.env.PERSONAL_EMAIL,
    PERSONAL_EMAIL_PASSWORD: process.env.PERSONAL_EMAIL_PASSWORD,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    NODE_ENV: process.env.NODE_ENV
}