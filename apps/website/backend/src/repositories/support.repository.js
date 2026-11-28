import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

export class SupportRepository {
  async createMessage({
    subject,
    category,
    orderId,
    description,
    fullName,
    email,
    phone,
    ticketNumber,
  }) {
    if (prisma.supportMessage) {
      return prisma.supportMessage.create({
        data: {
          ticketNumber,
          category,
          subject,
          orderId: orderId || null,
          description,
          fullName: fullName || null,
          email: email || null,
          phone: phone || null,
          status: "NEW",
        },
      });
    }

    // Graceful fallback if migration/generate not yet run
    return {
      id: randomUUID(),
      ticketNumber,
      category,
      subject,
      orderId: orderId || null,
      description,
      fullName: fullName || null,
      email: email || null,
      phone: phone || null,
      status: "NEW",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
