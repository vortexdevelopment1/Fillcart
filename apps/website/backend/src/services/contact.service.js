import { ContactRepository } from "../repositories/contact.repository.js";

export class ContactService {
  constructor() {
    this.contactRepo = new ContactRepository();
  }

  async createMessage(payload) {
    const record = await this.contactRepo.create(payload);
    return { id: record.id };
  }
}
