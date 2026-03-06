export class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  findAll() {
    return this.dao.findAll();
  }

  findById(id) {
    return this.dao.findById(id);
  }

  findByEmail(email) {
    return this.dao.findByEmail(email);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}
