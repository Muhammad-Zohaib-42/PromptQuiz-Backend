import mongoose, {Schema} from "mongoose";

const sessionSchema = new Schema({
    refreshToken: {
        type: String,
        required: [true, "refresh token is required"]
    },
    ip: {
        type: String,
        required: [true, "ip is required"]
    },
    userAgent: {
        type: String,
        required: [true, "user agent is required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user id is required"]
    },
    revoke: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export const sessionModel = mongoose.model("Session", sessionSchema)