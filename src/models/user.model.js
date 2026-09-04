import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username must be unique"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email must be unique"],
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        config.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m"
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        config.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
}

export const userModel = mongoose.model("User", userSchema)