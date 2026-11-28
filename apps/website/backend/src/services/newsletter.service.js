import { NewsletterRepository } from "../repositories/newsletter.repository.js";

export class NewsletterService {
  constructor() {
    this.newsletterRepo = new NewsletterRepository();
  }

  async subscribe(payload) {
    if (payload.honeypot || payload._hp) {
      return { id: "spam-filtered", message: "Subscribed successfully" };
    }

    const record = await this.newsletterRepo.subscribe(payload.email);

    return {
      id: record.id,
      email: record.email,
      message: "Subscribed successfully",
    };
  }
}
