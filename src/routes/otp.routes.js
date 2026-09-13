import {Router} from "express"
import * as otpControllers from "../controllers/otp.controllers.js"

const router = Router()

/**
 * @route GET /api/v1/otp/get
 * @desc returns the otp on the base of user email
 * @access Public
 */
router.get("/get", otpControllers.getOtpController)

/**
 * @route POST /api/v1/otp/send
 * @desc sends otp to user
 * @access Public
 */
router.post("/send", otpControllers.sendOtpController)

export default router