import passport from "passport";

export const requireAuth = () => passport.authenticate("jwt", { session: false });

export const authorizeRoles = (...roles) => (req, res, next) => {
  const role = req.user?.role;
  if (!role) return res.status(401).json({ error: "No autenticado" });
  if (!roles.includes(role)) {
    return res.status(403).json({ error: "No autorizado" });
  }
  return next();
};
