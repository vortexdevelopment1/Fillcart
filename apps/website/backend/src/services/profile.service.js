import { ProfileRepository } from "../repositories/profile.repository.js";
import { serialize } from "../utils/serialize.js";

export class ProfileService {
  constructor() {
    this.profileRepo = new ProfileRepository();
  }

  async getProfile(userId) {
    const profile = await this.profileRepo.getProfile(userId);
    return serialize(profile);
  }

  async updateProfile(userId, data) {
    const profile = await this.profileRepo.updateProfile(userId, data);
    return serialize(profile);
  }
}
