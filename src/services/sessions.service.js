import { userRepository } from "../repositories/index.js";
import { generateResetToken, verifyResetToken } from "../utils/jwt.js";
import { sendMail } from "../config/mailer.js";
import { env } from "../config/env.js";
import { userService } from "./user.service.js";

export class SessionsService {
  async requestPasswordReset(email) {
    const user = await userRepository.findByEmail(email);

    // Importante: no revelar si existe o no
    if (!user) return { ok: true };

    const token = generateResetToken({ id: user._id.toString(), email: user.email });

    const link = `${env.RESET_PASSWORD_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.4;">
        <h2>Restablecer contraseña</h2>
        <p>Hacé click en el botón para crear una nueva contraseña. Este enlace expira en <b>1 hora</b>.</p>
        <p style="margin: 24px 0;">
          <a href="${link}" 
             style="background:#111;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">
             Restablecer contraseña
          </a>
        </p>
        <p>Si no fuiste vos, ignorá este correo.</p>
      </div>
    `;

    await sendMail({
      to: user.email,
      subject: "Recuperación de contraseña",
      html,
      text: `Restablecé tu contraseña: ${link} (expira en 1 hora)`,
    });

    return { ok: true };
  }

  async resetPassword({ token, newPassword }) {
    let payload;
    try {
      payload = verifyResetToken(token);
    } catch (err) {
      const e = new Error("Token inválido o expirado");
      e.status = 400;
      throw e;
    }

    await userService.updatePassword({ userId: payload.id, newPassword });

    return { ok: true };
  }
}

export const sessionsService = new SessionsService();
