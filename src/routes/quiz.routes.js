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

/**
 * @route GET /api/v1/quiz/get/:id
 * @desc return quiz with that id
 * @access private
 */
router.get("/get/:id", authUser, quizControllers.getQuizController)

/**
 * @route GET /api/v1/quiz/get-all
 * @desc return all quizes data related to user
 * @access private
 */
router.get("/get-all", authUser, quizControllers.getQuizesController)

/**
 * @route DELETE /api/v1/quiz/delete/:id
 * @desc delete the quiz with provided id
 * @access private
 */
router.delete("/delete/:id", authUser, quizControllers.deleteQuizController)

/**
 * @route DELETE /api/v1/quiz/delete-all
 * @desc deletes all the quiz related to the user
 * @access private
 */
router.delete("/delete-all", authUser, quizControllers.deleteQuizesController)

export default router