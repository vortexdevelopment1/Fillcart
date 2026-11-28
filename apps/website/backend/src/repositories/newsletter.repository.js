import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

export class NewsletterRepository {
  async subscribe(email) {
    if (prisma.newsletterSubscriber) {
      // Upsert to be idempotent without throwing duplicate key errors
      return prisma.newsletterSubscriber.upsert({
        where: { email },
        update: { status: "SUBSCRIBED" },
        create: {
          email,
          status: "SUBSCRIBED",
        },
      });
    }

    return {
      id: randomUUID(),
      email,
      status: "SUBSCRIBED",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
