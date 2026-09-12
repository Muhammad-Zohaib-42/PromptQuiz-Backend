import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import { userModel } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"

export const authUser = asyncHandler(async (req, res, next) => {
    const {accessToken} = req.cookies

    if (!accessToken) {
        return res.status(401).json(
            new ApiError(401, "access token is required")
        )
    }

    let decoded = null

    try{
        decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET)
    } catch(error) {
        return res.status(401).json({
            message: "Invalid access token"
        })
    }

    const user = await userModel.findById(decoded._id)

    if (!user) {
        return res.status(409).json(
            new ApiError(409, "user not found")
        )
    }

    req.user = user
    next()
})