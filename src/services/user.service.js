import { userRepository, cartRepository } from "../repositories/index.js";
import { hashPassword, isValidPassword } from "../utils/crypto.js";

export class UserService {
  async register({ first_name, last_name, email, age, password, role }) {
    const exists = await userRepository.findByEmail(email);
    if (exists) {
      const err = new Error("Email ya registrado");
      err.status = 409;
      throw err;
    }

    const cart = await cartRepository.create({ products: [] });

    const user = await userRepository.create({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password),
      role: role || "user",
      cart: cart._id,
    });

    return user;
  }

  async list() {
    return userRepository.findAll();
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error("Usuario no encontrado");
      err.status = 404;
      throw err;
    }
    return user;
  }

  async update(id, data) {
    if (data.password) {
      data.password = hashPassword(data.password);
    }
    const updated = await userRepository.updateById(id, data);
    if (!updated) {
      const err = new Error("Usuario no encontrado");
      err.status = 404;
      throw err;
    }
    return updated;
  }

  async delete(id) {
    const deleted = await userRepository.deleteById(id);
    if (!deleted) {
      const err = new Error("Usuario no encontrado");
      err.status = 404;
      throw err;
    }
    return deleted;
  }

  async updatePassword({ userId, newPassword }) {
    const user = await this.getById(userId);

    // evitar misma password anterior
    if (isValidPassword(newPassword, user.password)) {
      const err = new Error("No podés usar la misma contraseña anterior");
      err.status = 400;
      throw err;
    }

    const updated = await userRepository.updateById(userId, {
      password: hashPassword(newPassword),
    });

    return updated;
  }
}

export const userService = new UserService();
