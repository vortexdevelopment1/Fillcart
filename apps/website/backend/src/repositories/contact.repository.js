import { prisma } from "../db/prisma.js";

export class ContactRepository {
  async create({ fullName, email, phone, subject, message }) {
    return prisma.contactMessage.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        status: "NEW",
      },
    });
  }
}
