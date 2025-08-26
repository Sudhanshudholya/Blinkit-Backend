
// const verifyEmailTemplate = ({name, url}) => {
//   return  `

//   <p>Dear ${name}</p>
   
//     <p>Thank you for registering Blinkit</p>
//     <a href= ${url} style="color: white; background: red; padding:20px; margin-top: 10px">
//       verify email
//     </a>
//   `
// }

// export default verifyEmailTemplate

const verifyEmailTemplate = ({ name, url }) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333333;">Hello ${name},</h2>
        
        <p style="font-size: 16px; color: #555555;">
          Thank you for registering with <strong>Blinkit</strong>! We're excited to have you on board.
        </p>
        
        <p style="font-size: 16px; color: #555555;">
          Please verify your email address by clicking the button below:
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${url}" style="background-color: #e60023; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email
          </a>
        </div>

        <p style="font-size: 14px; color: #999999;">
          If you didn’t request this, you can ignore this email.
        </p>

        <p style="font-size: 14px; color: #999999;">
          — The Blinkit Team
        </p>
      </div>
    </div>
  `;
};

export default verifyEmailTemplate;
