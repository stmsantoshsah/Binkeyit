const forgotPasswordTemplate = ({ name, otp }) => {
    return `
        <div style="padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>You requested to reset your password. Use the OTP below to proceed:</p>
            <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</h3>
            <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            <p>Thanks,</p>
            <p><strong>Binkeyit</strong></p>
        </div>
    `
};

export default forgotPasswordTemplate;
