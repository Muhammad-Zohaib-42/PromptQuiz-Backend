import mongoose, {Schema} from "mongoose"

const quizSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user id is required"]
    },
    prompt: {
        type: String,
        required: [true, "user prompt is required"]
    },
    QuestionFormat: {
        type: String,
        required: [true, "quiz format is required"]
    },
    difficultyLevel: {
        type: String,
        required: [true, "difficulty level is required"]
    },
    perQuestionTimer: {
        type: Number,
        required: [true, "per question countdown timer is required"]
    },
    quiz: {
        type: [
            {
                id: String,
                question: String,
                options: [String],
                correctAnswer: String,
                userSelected: String
            }
        ],
        required: [true, "quiz data is required"]
    }
}, {timestamps: true})

export const quizModel = mongoose.model("Quiz", quizSchema)