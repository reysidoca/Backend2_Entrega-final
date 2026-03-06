import { TicketModel } from "../../models/Ticket.js";

export class TicketDAO {
  async create(data) {
    const doc = await TicketModel.create(data);
    return doc.toObject();
  }

  async findById(id) {
    return TicketModel.findById(id).lean();
  }

  async findAll() {
    return TicketModel.find().lean();
  }
}
