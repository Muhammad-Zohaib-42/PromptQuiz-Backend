import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @route POST /api/v1/quiz/create
 * @desc expects prompt (topic), length (number of questions), difficulty level, question format and per question countdown timer to generate real time quiz using gemini ai  
 * @access private
 */
export const createQuizController = asyncHandler(async (req, res) => {
    const {prompt, length, difficulty, format, timer} = req.body

    if ([prompt, length, difficulty, format, timer].some(field => !field)) {
        return res.status(400).json(
            new ApiError(400, "All fields are required")
        )
    }
})