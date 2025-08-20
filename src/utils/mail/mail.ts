import nodemailer from "nodemailer";
import "dotenv/config";
import ejs from "ejs";
import path from "path";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const transporter = nodemailer.createTransport({
  host: String(process.env.EMAIL_SMTP_HOST),
  port: Number(process.env.EMAIL_SMTP_PORT),
  secure: Boolean(process.env.EMAIL_SMTP_SECURE),
  auth: {
    user: String(process.env.EMAIL_SMTP_USER),
    pass: String(process.env.EMAIL_SMTP_PASS),
  },
  requireTLS: true,
});

export const sendMail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: options.from || process.env.MAIL_FROM || "noreply@example.com",
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const renderMailTemplate = async (
  template: string,
  data: any
): Promise<string> => {
  const templatePath = path.join(__dirname, "../templates", `${template}.ejs`);
  return (await ejs.renderFile(templatePath, data)) as string;
};
