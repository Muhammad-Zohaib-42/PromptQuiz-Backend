import { config } from "./config/config.js"

export const DB_NAME = "ai-quiz-app"

export const refreshTokenOptions = {
    httpOnly: true,
    secure: config.NODE_ENV == "development" ? false : true,
    sameSite: config.NODE_ENV == "development" ? "strict" : "none"
}