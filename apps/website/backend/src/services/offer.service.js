import { OfferRepository } from "../repositories/offer.repository.js";
import { serialize } from "../utils/serialize.js";

export class OfferService {
  constructor() {
    this.offerRepo = new OfferRepository();
  }

  async getOffers({ type } = {}) {
    const offers = await this.offerRepo.findAll({ type });
    return offers.map(serialize);
  }
}
