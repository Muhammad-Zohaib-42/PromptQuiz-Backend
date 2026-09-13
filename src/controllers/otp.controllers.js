import { otpModel } from "../models/otp.model.js";
import { userModel } from "../models/user.model.js";
import { sendEmail } from "../services/email.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOtp, generateOtpHtml } from "../utils/utils.js";

/**
 * @route GET /api/v1/otp/get
 * @desc expects the user email and sends back the otp 
 * @access public
 */
export const getOtpController = asyncHandler(async (req, res) => {
    const {email} = req.query

    if (!email) {
        return res.status(400).json(
            new ApiError(400, "email is required")
        )
    }

    const user = await userModel.findOne({email})

    if (!user) {
        return res.status(409).json(
            new ApiError(409, "user with this email doesn't exist")
        )
    }

    const otp = await otpModel.findOne({email})

    if (!otp) {
        return res.status(409).json(
            new ApiError(409, "otp with this email doesn't exist")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, "otp fetched successfully", {otp})
    )
})

/**
 * @route POST /api/v1/otp/send
 * @desc expects the user email and sends otp to user email 
 * @access public
 */
export const sendOtpController = asyncHandler(async (req, res) => {
    const {email} = req.body

    if (!email) {
        return res.status(400).json(
            new ApiError(400, "email is required")
        )
    }

    const user = await userModel.findOne({email})

    if (!user) {
        return res.status(409).json(
            new ApiError(409, "user with this email doesn't exist")
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

    if (!response) {
        return res.status(500).json(
            new ApiError(500, "email send failed")
        )
    }
    
    return res.status(200).json(
        new ApiResponse(200, "OTP send successfully", {})
    )
})