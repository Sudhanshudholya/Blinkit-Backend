const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f4f6; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color: #4CAF50; padding: 20px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Blinkit</h1>
        <p style="color: white; margin-top: 5px; font-size: 14px;">Secure Password Reset</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px 30px 40px 30px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>

        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          We received a request to reset your password. Please use the OTP code below to proceed:
        </p>

        <div style="text-align: center; margin: 35px 0;">
          <span style="
            display: inline-block;
            background-color: #4CAF50;
            color: #ffffff;
            padding: 15px 40px;
            font-size: 24px;
            font-weight: bold;
            border-radius: 8px;
            letter-spacing: 2px;
            ">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #666; text-align: center;">
          This OTP is valid for <strong>1 hour</strong>. Enter it on the <a href="https://www.blinkit.com" style="color: #4CAF50; text-decoration: none;">Blinkit</a> website to complete your password reset.
        </p>

        <p style="margin-top: 40px; font-size: 14px; color: #999;">
          If you didn’t request this, you can ignore this email — your account is still secure.
        </p>

        <p style="margin-top: 40px; font-size: 14px; color: #333;">
          Best regards,<br/>
          <strong>The Blinkit Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f0f0f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} Blinkit. All rights reserved.
      </div>

    </div>
  </div>
  `;
};

export default forgotPasswordTemplate;
