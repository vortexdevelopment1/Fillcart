import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

const fallbackProfiles = new Map();

export class ProfileRepository {
  async getProfile(userId) {
    if (prisma.customerProfile) {
      let profile = await prisma.customerProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        profile = await prisma.customerProfile.create({
          data: { userId },
        });
      }

      return profile;
    }

    if (!fallbackProfiles.has(userId)) {
      fallbackProfiles.set(userId, {
        id: randomUUID(),
        userId,
        fullName: null,
        phone: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return fallbackProfiles.get(userId);
  }

  async updateProfile(userId, data) {
    if (prisma.customerProfile) {
      return prisma.customerProfile.upsert({
        where: { userId },
        update: {
          fullName: data.fullName !== undefined ? data.fullName : undefined,
          phone: data.phone !== undefined ? (data.phone || null) : undefined,
          avatarUrl: data.avatarUrl !== undefined ? (data.avatarUrl || null) : undefined,
        },
        create: {
          userId,
          fullName: data.fullName || null,
          phone: data.phone || null,
          avatarUrl: data.avatarUrl || null,
        },
      });
    }

    const profile = await this.getProfile(userId);
    if (data.fullName !== undefined) profile.fullName = data.fullName;
    if (data.phone !== undefined) profile.phone = data.phone || null;
    if (data.avatarUrl !== undefined) profile.avatarUrl = data.avatarUrl || null;
    profile.updatedAt = new Date();
    return profile;
  }
}
