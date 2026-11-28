import { AddressRepository } from "../repositories/address.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { serialize } from "../utils/serialize.js";

export class AddressService {
  constructor() {
    this.addressRepo = new AddressRepository();
  }

  async getAddresses(userId) {
    const addresses = await this.addressRepo.findAll(userId);
    return addresses.map(serialize);
  }

  async createAddress(userId, data) {
    const address = await this.addressRepo.create(userId, data);
    return serialize(address);
  }

  async updateAddress(id, userId, data) {
    const existing = await this.addressRepo.findById(id, userId);
    if (!existing) {
      throw new ApiError(404, "Address not found", "NOT_FOUND");
    }

    const updated = await this.addressRepo.update(id, userId, data);
    return serialize(updated);
  }

  async deleteAddress(id, userId) {
    const existing = await this.addressRepo.findById(id, userId);
    if (!existing) {
      throw new ApiError(404, "Address not found", "NOT_FOUND");
    }

    await this.addressRepo.delete(id, userId);
    return { message: "Address deleted successfully" };
  }

  async setDefault(id, userId) {
    const existing = await this.addressRepo.findById(id, userId);
    if (!existing) {
      throw new ApiError(404, "Address not found", "NOT_FOUND");
    }

    const updated = await this.addressRepo.setDefault(id, userId);
    return serialize(updated);
  }
}
