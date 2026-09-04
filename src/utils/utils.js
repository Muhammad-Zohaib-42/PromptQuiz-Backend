export function generateOtp() {
    return Math.floor((Math.random() * 900000) + 100000)
}

export function generateOtpHtml(otp) {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 40px 0;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <div style="background-color: #0f172a; padding: 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">PromptQuiz</h1>
                </div>

                <!-- Body Content -->
                <div style="padding: 32px 24px; text-align: left; color: #334155;">
                    <h2 style="font-size: 18px; font-weight: 600; margin-top: 0; color: #1e293b;">Email Verification</h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                        Hello, thank you for registering with PromptQuiz. Please use the verification code below to complete your sign-up process. This code is valid for a limited time (15 minutes).
                    </p>

                    <!-- OTP Box -->
                    <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 16px; text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #0f172a;">${otp}</span>
                    </div>

                    <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin-bottom: 0;">
                        If you didn't request this code, you can safely ignore this email. Someone may have typed your email address by mistake.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                        &copy; 2026 PromptQuiz. All rights reserved.
                    </p>
                </div>

            </div>
        </div>
    `
}

export function generateAccessAndRefreshTokens(user) {
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    return {accessToken, refreshToken}
}