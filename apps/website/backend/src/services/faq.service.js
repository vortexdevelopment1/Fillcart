import { FaqRepository } from "../repositories/faq.repository.js";

export class FaqService {
  constructor() {
    this.faqRepo = new FaqRepository();
  }

  getFaqs(filters = {}) {
    return this.faqRepo.findAll(filters);
  }
}
