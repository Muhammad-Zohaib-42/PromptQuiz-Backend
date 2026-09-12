// import nodemailer from "nodemailer"
// import { config } from "../config/config.js"

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: config.PERSONAL_EMAIL,
//         pass: config.PERSONAL_EMAIL_PASSWORD
//     }
// })

// export async function sendEmail(email, otpHtml) {
//     try {
//         const response = await transporter.sendMail({
//             from: `PromptQuiz ${config.PERSONAL_EMAIL}`,
//             to: email,
//             subject: 'Your OTP Verification Code',
//             html: otpHtml
//         })
    
//         return response
//     } catch (error) {
//         console.log(error)
//     }
// }

import { Resend } from "resend";
import { config } from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export async function sendEmail(email, otpHtml) {
    try {
        const data = await resend.emails.send({
            from: "PromptQuiz <onboarding@resend.dev>", // Or your verified domain if you have one
            to: [email],
            subject: "Your OTP Verification Code",
            html: otpHtml,
        });

        return data;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error; // Throw so you can catch it in controllers if needed
    }
}