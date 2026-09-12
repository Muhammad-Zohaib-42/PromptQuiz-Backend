import { config } from "../config/config.js";
import { accessTokenOptions, refreshTokenOptions } from "../constants.js";
import { otpModel } from "../models/otp.model.js";
import { sessionModel } from "../models/session.model.js";
import { userModel } from "../models/user.model.js";
import { sendEmail } from "../services/email.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens, generateOtp, generateOtpHtml } from "../utils/utils.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"

/**
 * @route POST /api/v1/auth/register
 * @desc expects username, email and password from request body and registers a new user
 * @access Public
 */
export const registerUserController = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body

    if (!username || !email || !password) {
        return res.status(400).json(
            new ApiError(400, "All fields are required")
        )
    }

    const isAlreadyExist = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if (isAlreadyExist) {
        return res.status(409).json(
            new ApiError(409, "user with this username or email already exist")
        )
    }

    const user = await userModel.create({username, email, password})

    if (!user) {
        return res.status(500).json(
            new ApiError(500, "Something went wrong while creating user")
        )
    }

    const otp = generateOtp()
    const otpHtml = generateOtpHtml(otp)

    const otpDoc = await otpModel.create({otp, email, user: user._id})

    if (!otpDoc) {
        return res.status(500).json(
            new ApiError(500, "Something went wrong while creating otp doc")
        )
    }

    const response = await sendEmail(email, otpHtml)

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully. Please check your email for the OTP verification code", {
            user: {userId: user._id,
                username: user.username,
            email: user.email,
            isVerified: user.isVerified}
        })
    )
})

/**
 * @route POST /api/v1/auth/verify-email
 * @desc expects otp and email from request body and verifies the user's email
 * @access Public
 */
export const verifyEmailController = asyncHandler(async (req, res) => {
    const {otp, email} = req.body

    if (!otp || !email) {
        return res.status(400).json(
            new ApiError(400, "All fields are required")
        )
    }

    const otpDoc = await otpModel.findOne({email})

    if (!otpDoc) {
        return res.status(404).json(
            new ApiError(404, "OTP not found for this email")
        )
    }

    const isOtpCorrect = otpDoc.isOtpCorrect(otp)

    if (!isOtpCorrect) {
        return res.status(400).json(
            new ApiError(400, "incorrect otp")
        )
    }

    const deletedOtps = await otpModel.deleteMany({email})

    if (!deletedOtps) {
        return res.status(500).json(
            new ApiError(500, "something went wrong while deleting all otps")
        )
    }

    const user = await userModel.findOneAndUpdate({email}, {isVerified: true}, {returnDocument: "after"})

    if (!user) {
        return res.status(409).json(
            new ApiError(409, "user with this email doesn't exist")
        )
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshTokens(user)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        refreshToken: refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        user: user._id,
    })

    if (!session) {
        return res.status(500).json(
            new ApiError(500, "something went wrong while creating session")
        )
    }

    return res.status(200).cookie("refreshToken", refreshToken, refreshTokenOptions).cookie("accessToken", accessToken, accessTokenOptions).json(
        new ApiResponse(200, "email verified successfully", {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }
        })
    )
})

/**
 * @route POST /api/v1/auth/resend-otp
 * @desc expects email from request body and resend otp
 * @access public
 */
export const resendOtpController = asyncHandler(async (req, res) => {
    const {email} = req.body

    if (!email) {
        return res.status(400).json(
            new ApiError(400, "All fields are required")
        )
    }

    const user = await userModel.findOne({email})

    if (!user) {
        return res.status(409).json(
            new ApiError(409, "user with this email doesn't exist")
        )
    }

    const otp = generateOtp()

    const otpDoc = await otpModel.create({otp, email, user: user._id})

    if (!otpDoc) {
        return res.status(409).json(
            new ApiError(409, "something went wrong while generating OTP doc")
        )
    }

    const otpHtml = generateOtpHtml(otp)

    await sendEmail(email, otpHtml)

    return res.status(200).json(
        new ApiResponse(200, "OTP sent successfully")
    )
})

/**
 * @route POST /api/v1/auth/login
 * @desc expects email and password from request body and login the user
 * @access public
 */
export const loginUserController = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json(
            new ApiError(400, "All fields are required")
        )
    }

    const user = await userModel.findOne({email})

    if (!user) {
        return res.status(409).json(
            new ApiError(409, "user with this email doesn't exist")
        )
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        return res.status(400).json(
            new ApiError(400, "invalid credentials")
        )
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshTokens(user)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        refreshToken: refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        user: user._id
    })

    if (!session) {
        return res.status(500).json(
            new ApiError(500, "something went wrong while creating session")
        )
    }

    return res.status(200).cookie("refreshToken", refreshToken, refreshTokenOptions).cookie("accessToken", accessToken, accessTokenOptions).json(
        new ApiResponse(200, "user loggedIn successfully", {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }
        })
    )
})

/**
 * @route POST /api/v1/auth/rotate-tokens
 * @desc expects refresh token from request cookies and rotate access and refresh tokens
 * @access private
 */
export const rotateTokensController = asyncHandler(async (req, res) => {
    const {refreshToken} = req.cookies

    if (!refreshToken) {
        return res.status(401).json(
            new ApiError(401, "refresh token is required")
        )
    }

    let decoded = null

    try {
        decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET)
    } catch(error) {
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({refreshToken: refreshTokenHash, revoke: false})

    if (!session) {
        return res.status(401).json(
            new ApiError(401, "Invalid refresh token")
        )
    }

    const user = await userModel.findById(session.user)

    const {accessToken, refreshToken: newRefreshToken} = generateAccessAndRefreshTokens(user)

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")

    session.refreshToken = newRefreshTokenHash
    await session.save()

    return res.status(200).cookie("refreshToken", newRefreshToken, refreshTokenOptions).cookie("accessToken", accessToken, accessTokenOptions).json(
        new ApiResponse(200, "tokens rotated successfully", {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }
        })
    )
})

/**
 * @route POST /api/v1/auth/logout
 * @desc expects access token from request headers and logout the user by revoking the refresh token and clearing from cookies
 * @access private
 */
export const logoutUserController = asyncHandler(async (req, res) => {
    const {user} = req
    const {refreshToken} = req.cookies

    if (!refreshToken) {
        return res.status(401).json(
            new ApiError(401, "refresh token is required")
        )
    }

    let decoded = null

    try {
        decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET)
    } catch(error) {
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOneAndUpdate({refreshToken: refreshTokenHash, user: user._id}, {revoke: true}, {returnDocument: "after"})

    return res.status(200).clearCookie("refreshToken", refreshTokenOptions).clearCookie("accessToken", accessTokenOptions).json(
        new ApiResponse(200, "user loggedOut successfully", {
            session: {
                revoke: session.revoke
            }
        })
    )
})

/**
 * @route POST /api/v1/auth/logout-all
 * @desc expects access token from request headers and logout the user from all devices by revoking the refresh token and clearing from cookies
 * @access private
 */
export const logoutAllController = asyncHandler(async (req, res) => {
    const {user} = req

    await sessionModel.updateMany({user: user._id}, {revoke: true}, {returnDocument: "after"})

    return res.status(200).clearCookie("refreshToken", refreshTokenOptions).clearCookie("accessToken", accessTokenOptions).json(
        new ApiResponse(200, "user loggedOut from all devices successfully")
    )
})

/**
 * @route GET /api/v1/auth/get-me
 * @desc expects access token from request headers and fetched and returns the users data
 * @access private
 */
export const getMeController = asyncHandler(async (req, res) => {
    const {user} = req

    return res.status(200).json(
        new ApiResponse(200, "user fetched successfully", {
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                isVerified: user.isVerified
            }
        })
    )
})