import { userService } from "../services/user.service.js";

export class UsersController {
  list = async (req, res) => {
    const users = await userService.list();
    res.json({ status: "success", users });
  };

  getById = async (req, res) => {
    const user = await userService.getById(req.params.uid);
    res.json({ status: "success", user });
  };

  create = async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const user = await userService.register({ first_name, last_name, email, age, password, role });
    res.status(201).json({ status: "success", userId: user._id });
  };

  update = async (req, res) => {
    const updated = await userService.update(req.params.uid, req.body);
    res.json({ status: "success", user: updated });
  };

  delete = async (req, res) => {
    const deleted = await userService.delete(req.params.uid);
    res.json({ status: "success", user: deleted });
  };
}

export const usersController = new UsersController();
