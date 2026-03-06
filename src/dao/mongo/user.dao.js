import { UserModel } from "../../models/User.js";

export class UserDAO {
  async create(data) {
    const doc = await UserModel.create(data);
    return doc.toObject();
  }

  async findById(id) {
    return UserModel.findById(id).lean();
  }

  async findByEmail(email) {
    return UserModel.findOne({ email }).lean();
  }

  async findAll() {
    return UserModel.find().lean();
  }

  async updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id).lean();
  }
}
