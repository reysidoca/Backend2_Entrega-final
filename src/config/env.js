import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 8080,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",

  RESET_PASSWORD_SECRET: process.env.RESET_PASSWORD_SECRET || process.env.JWT_SECRET,
  RESET_PASSWORD_BASE_URL: process.env.RESET_PASSWORD_BASE_URL || "http://localhost:8080",

  // Mailing
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  MAIL_FROM: process.env.MAIL_FROM || process.env.SMTP_USER,
};

export const assertEnv = () => {
  const required = ["MONGO_URL", "JWT_SECRET"]; // mailing secrets can be optional for local dev
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
};
