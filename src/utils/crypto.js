import bcrypt from "bcrypt";

/**
 * Encripta password con bcrypt usando hashSync (pedido por consigna)
 */
export const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/**
 * Valida password contra hash guardado
 */
export const isValidPassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);
