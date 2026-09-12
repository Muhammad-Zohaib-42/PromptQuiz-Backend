import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {quizModel} from "../models/quiz.model.js"
import { generateQuiz } from "../services/ai.service.js";

/**
 * @route POST /api/v1/quiz/create
 * @desc expects access token in request headers and prompt (topic), length (number of questions), difficulty level, question format and per question countdown timer in request body to generate real time quiz using gemini ai  
 * @access private
 */
export const createQuizController = asyncHandler(async (req, res) => {
    const {topic, length, difficulty, format, timer} = req.body
    const {user} = req

    if ([topic, length, difficulty, format, timer].some(field => field === "")) {
        return res.status(400).json(
            new ApiError(400, "All fields are required")
        )
    }

    const quizData = await generateQuiz(topic, length, difficulty, format)

    const quiz = await quizModel.create({
        user: user._id,
        topic,
        length,
        difficulty,
        format,
        timer,
        quiz: quizData
    })

    return res.status(201).json(
        new ApiResponse(201, "quiz generated successfully", {
            quiz
        })
    )
})

/**
 * @route PATCH /api/v1/quiz/create
 * @desc expects access token in request headers and fields that you want to update in request body to update the quiz  
 * @access private
 */
export const updateQuizController = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {user} = req
    const {score, accuracy, completed, questionIndex, userSelected} = req.body

    const updateFields = {}

    // Fixed: check for undefined so valid numbers and booleans are captured
    if (score !== undefined) updateFields.score = score;
    if (accuracy !== undefined) updateFields.accuracy = accuracy;
    if (completed !== undefined) updateFields.completed = completed;
    
    // Fixed: check that questionIndex is a valid number (including 0) and userSelected is provided
    if (questionIndex !== undefined && questionIndex >= 0 && userSelected !== undefined) {
        updateFields[`quiz.${questionIndex}.userSelected`] = userSelected;
    }

    const updatedQuiz = await quizModel.findOneAndUpdate(
        {_id: id, user: user._id},
        {$set: updateFields},
        {returnDocument: "after"}
    )

    if (!updatedQuiz) {
        return res.status(404).json(
            new ApiError(404, "Quiz not found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, "quiz updated successfully", {updatedQuiz})
    )
})

/**
 * @route GET /api/v1/quiz/get/:id
 * @desc expects access token in request headers and quiz id in params and return back the quiz  
 * @access private
 */
export const getQuizController = asyncHandler(async (req, res) => {
    const {id} = req.params

    if (!id) {
        return res.status(400).json(
            new ApiError(400, "quiz id is required")
        )
    }

    const quiz = await quizModel.findById(id)

    if (!quiz) {
        return res.status(409).json(
            new ApiError(409, "quiz not found with this id")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, "quiz data fetched successfully", {
            quiz
        })
    )
})

/**
 * @route GET /api/v1/quiz/get-all
 * @desc expects access token in request headers returns all quiz related to that user  
 * @access private
 */
export const getQuizesController = asyncHandler(async (req, res) => {
    const {user} = req

    const quizes = await quizModel.find({user: user._id})

    return res.status(200).json(
        new ApiResponse(200, "all quizes data fetched successfully", {
            quizes
        })
    )
})

/**
 * @route DELETE /api/v1/quiz/delete/:id
 * @desc expects access token in request headers and id in request params to delete the quiz  
 * @access private
 */
export const deleteQuizController = asyncHandler(async (req, res) => {
    const {id} = req.params

    const deletedQuiz = await quizModel.findByIdAndDelete(id)

    return res.status(200).json(
        new ApiResponse(200, "quiz deleted successfully", {
            deletedQuiz
        })
    )
})

/**
 * @route DELETE /api/v1/quiz/delete-all
 * @desc expects access token in request headers delete all the quizes related to the user  
 * @access private
 */
export const deleteQuizesController = asyncHandler(async (req, res) => {
    const {user} = req

    const deletedQuizes = await quizModel.deleteMany({user: user._id})

    return res.status(200).json(
        new ApiResponse(200, "all quizes deleted successfully", {
            deletedQuizes
        })
    )
})