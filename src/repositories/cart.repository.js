export class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data = {}) {
    return this.dao.create(data);
  }

  findById(id) {
    return this.dao.findById(id);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}
