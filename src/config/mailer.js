import nodemailer from "nodemailer";
import { env } from "./env.js";

let transporter = null;

export const getTransporter = () => {
  if (transporter) return transporter;

  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn("⚠️  Mailing no configurado (SMTP_HOST/SMTP_USER/SMTP_PASS). Forgot/reset no enviará emails.");
    transporter = null;
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendMail = async ({ to, subject, html, text }) => {
  const t = getTransporter();
  if (!t) return false;

  await t.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });

  return true;
};
