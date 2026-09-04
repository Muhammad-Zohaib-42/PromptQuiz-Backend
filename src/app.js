import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    const message = err.message || "Internal server error"

    res.status(statusCode).json({
        message
    })
})

// importing routes
import authRoutes from "./routes/auth.routes.js"
import quizRoutes from "./routes/quiz.routes.js"

// declaring routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/quiz", quizRoutes)

export { app }