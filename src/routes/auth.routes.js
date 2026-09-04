import {Router} from "express"
import * as authControllers from "../controllers/auth.controllers.js"
import { authUser } from "../middlewares/auth.middleware.js"

const router = Router()

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", authControllers.registerUserController)

/**
 * @route POST /api/v1/auth/verify-email
 * @desc Verify user's email
 * @access Public
 */
router.post("/verify-email", authControllers.verifyEmailController)

/**
 * @route POST /api/v1/auth/resend-otp
 * @desc resend the otp to user
 * @access public
 */
router.post("/resend-otp", authControllers.resendOtpController)

/**
 * @route POST /api/v1/auth/login
 * @desc login user
 * @access public
 */
router.post("/login", authControllers.loginUserController)

/**
 * @route POST /api/v1/auth/rotate-tokens
 * @desc rotate the access and refresh tokens
 * @access private
 */
router.post("/rotate-tokens", authControllers.rotateTokensController)

/**
 * @route POST /api/v1/auth/logout
 * @desc logout user and delete the session
 * @access private
 */
router.post("/logout", authUser, authControllers.logoutUserController)

/**
 * @route POST /api/v1/auth/logout-all
 * @desc logout user from all devices
 * @access private
 */
router.post("/logout-all", authUser, authControllers.logoutAllController)

export default router