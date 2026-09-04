import {Router} from "express"
import { authUser } from "../middlewares/auth.middleware.js"
import * as quizControllers from "../controllers/quiz.controllers.js"

const router = Router()

/**
 * @route POST /api/v1/quiz/create
 * @desc Create Quiz using Gemini Api
 * @access private
 */
router.post("/create", authUser, quizControllers.createQuizController)

export default router