export class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  findById(id) {
    return this.dao.findById(id);
  }

  findAll() {
    return this.dao.findAll();
  }
}
