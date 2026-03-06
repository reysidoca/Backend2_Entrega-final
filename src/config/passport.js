import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { userRepository } from "../repositories/index.js";
import { isValidPassword } from "../utils/crypto.js";
import { env } from "./env.js";

/**
 * Extrae JWT desde cookie httpOnly "token"
 */
const cookieExtractor = (req) => req?.cookies?.token || null;

export const initializePassport = () => {
  // Local login (email + password)
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password", session: false },
      async (email, password, done) => {
        try {
          const user = await userRepository.findByEmail(email);
          if (!user) return done(null, false, { message: "Usuario no encontrado" });

          if (!isValidPassword(password, user.password)) {
            return done(null, false, { message: "Credenciales inválidas" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          ExtractJwt.fromAuthHeaderAsBearerToken(),
          cookieExtractor,
        ]),
        secretOrKey: env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await userRepository.findById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
