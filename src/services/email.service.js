import nodemailer from "nodemailer"
import { config } from "../config/config.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.PERSONAL_EMAIL,
        pass: config.PERSONAL_EMAIL_PASSWORD
    }
})

export async function sendEmail(email, otpHtml) {
    try {
        const response = await transporter.sendMail({
            from: `PromptQuiz ${config.PERSONAL_EMAIL}`,
            to: email,
            subject: 'Your OTP Verification Code',
            html: otpHtml
        })
    
        return response
    } catch (error) {
        console.log(error)
    }
}