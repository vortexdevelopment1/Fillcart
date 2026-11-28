import { SupportRepository } from "../repositories/support.repository.js";

export class SupportService {
  constructor() {
    this.supportRepo = new SupportRepository();
  }

  async submitSupportMessage(payload) {
    if (payload.honeypot || payload._hp) {
      return { id: "spam-filtered", ticketNumber: "TKT-SPAM", message: "Support ticket submitted successfully" };
    }

    const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const record = await this.supportRepo.createMessage({
      ticketNumber,
      category: payload.category,
      subject: payload.subject,
      orderId: payload.orderId,
      description: payload.description,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
    });

    return {
      id: record.id,
      ticketNumber,
      message: "Support ticket created successfully",
    };
  }
}
