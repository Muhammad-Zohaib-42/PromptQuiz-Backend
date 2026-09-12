import mongoose, {Schema} from "mongoose"

const quizSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user id is required"]
    },
    topic: {
        type: String,
        required: [true, "user prompt is required"]
    },
    length: {
        type: Number,
        required: [true, "quiz length is required"]
    },
    difficulty: {
        type: String,
        required: [true, "difficulty level is required"]
    },
    format: {
        type: String,
        required: [true, "quiz format is required"]
    },
    completed: {
        type: Boolean,
        default: false
    },
    timer: {
        type: Number,
        required: [true, "per question countdown timer is required"]
    },
    score: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0
    },
    quiz: {
        type: [
            {
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