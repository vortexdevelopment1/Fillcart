import { generateDeliverySlots } from "../config/deliverySlots.js";

export class DeliverySlotService {
  async getDeliverySlots({ days = 2 } = {}) {
    return generateDeliverySlots({ days });
  }
}
