import passport from "passport";
import { userService } from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";
import { CurrentUserDTO } from "../dtos/currentUser.dto.js";
import { sessionsService } from "../services/sessions.service.js";

export class SessionsController {
  register = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const user = await userService.register({ first_name, last_name, email, age, password });
    res.status(201).json({ status: "success", userId: user._id });
  };

  login = (req, res, next) => {
    passport.authenticate("login", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || "Credenciales inválidas" });
      }

      const token = generateToken({
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.json({ status: "success" });
    })(req, res, next);
  };

  current = async (req, res) => {
    // req.user viene de passport-jwt
    const dto = new CurrentUserDTO(req.user);
    res.json({ status: "success", user: dto });
  };

  logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ status: "success" });
  };

  forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });
    await sessionsService.requestPasswordReset(email);
    // siempre responder ok para no filtrar existencia
    res.json({ status: "success", message: "Si el email existe, se envió un correo de recuperación" });
  };

  resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "token y newPassword son requeridos" });
    }

    await sessionsService.resetPassword({ token, newPassword });
    res.json({ status: "success", message: "Contraseña actualizada" });
  };
}

export const sessionsController = new SessionsController();
