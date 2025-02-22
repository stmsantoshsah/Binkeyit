const verifyEmailTemplate = ({ name, url }) => {
    return `
    <div style="line-height: 1.6; color: #333;">
        <h2>Welcome to Binkeyit, ${name}! 🎉</h2>
        <p>Thank you for registering with us. Please click the button below to verify your email and activate your account:</p>
        
        <div style="margin: 20px 0;">
            <a href="${url}" target="_blank"
               style="display: inline-block; padding: 12px 24px; background-color: #007BFF; 
                      color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verify Email
            </a>
        </div>

        <p>If you didn't create an account, please ignore this email.</p>
        <p>Best Regards,<br> The Binkeyit Team</p>
    </div>
    `;
};

export default verifyEmailTemplate;
