import mongoose, {Schema} from "mongoose";

const otpSchema = new Schema({
    otp: {
        type: String,
        required: [true, "otp is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user id is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 15 * 60
    }
}, {timestamps: true})

otpSchema.methods.isOtpCorrect = function(otp) {
    return this.otp == otp
}

export const otpModel = mongoose.model("Otp", otpSchema)