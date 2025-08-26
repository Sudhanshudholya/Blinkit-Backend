import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const RESEND_API = process.env.RESEND_API;

if (!RESEND_API) {
  console.log("Please provide RESEND_API in side the .env file");
}

const resend = new Resend(RESEND_API);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Blinkit <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      return console.error({ error });
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail