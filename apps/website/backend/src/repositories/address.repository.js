import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

const fallbackAddresses = new Map();

export class AddressRepository {
  async findAll(userId) {
    if (prisma.address) {
      return prisma.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });
    }

    return Array.from(fallbackAddresses.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  }

  async findById(id, userId) {
    if (prisma.address) {
      return prisma.address.findFirst({
        where: { id, userId },
      });
    }

    const addr = fallbackAddresses.get(id);
    return addr && addr.userId === userId ? addr : null;
  }

  async create(userId, data) {
    const isFirstAddress = await this.countByUserId(userId).then((c) => c === 0);
    const shouldBeDefault = data.isDefault || isFirstAddress;

    if (prisma.address) {
      return prisma.$transaction(async (tx) => {
        if (shouldBeDefault) {
          await tx.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
          });
        }

        return tx.address.create({
          data: {
            userId,
            label: data.label || "Home",
            fullName: data.fullName,
            phone: data.phone,
            line1: data.line1,
            line2: data.line2 || null,
            landmark: data.landmark || null,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            isDefault: shouldBeDefault,
          },
        });
      });
    }

    // In-memory fallback
    if (shouldBeDefault) {
      for (const a of fallbackAddresses.values()) {
        if (a.userId === userId) a.isDefault = false;
      }
    }
    const newAddr = {
      id: randomUUID(),
      userId,
      label: data.label || "Home",
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || null,
      landmark: data.landmark || null,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      isDefault: shouldBeDefault,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fallbackAddresses.set(newAddr.id, newAddr);
    return newAddr;
  }

  async countByUserId(userId) {
    if (prisma.address) {
      return prisma.address.count({ where: { userId } });
    }
    return Array.from(fallbackAddresses.values()).filter((a) => a.userId === userId).length;
  }

  async update(id, userId, data) {
    if (prisma.address) {
      return prisma.$transaction(async (tx) => {
        if (data.isDefault) {
          await tx.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
          });
        }

        return tx.address.update({
          where: { id },
          data: {
            ...data,
            line2: data.line2 !== undefined ? (data.line2 || null) : undefined,
            landmark: data.landmark !== undefined ? (data.landmark || null) : undefined,
          },
        });
      });
    }

    const addr = fallbackAddresses.get(id);
    if (!addr || addr.userId !== userId) return null;
    if (data.isDefault) {
      for (const a of fallbackAddresses.values()) {
        if (a.userId === userId) a.isDefault = false;
      }
    }
    Object.assign(addr, data, { updatedAt: new Date() });
    return addr;
  }

  async delete(id, userId) {
    if (prisma.address) {
      const existing = await prisma.address.findFirst({ where: { id, userId } });
      if (!existing) return null;

      await prisma.address.delete({ where: { id } });

      // If deleted address was default, promote next address if any
      if (existing.isDefault) {
        const nextAddr = await prisma.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
        if (nextAddr) {
          await prisma.address.update({
            where: { id: nextAddr.id },
            data: { isDefault: true },
          });
        }
      }
      return existing;
    }

    const addr = fallbackAddresses.get(id);
    if (!addr || addr.userId !== userId) return null;
    fallbackAddresses.delete(id);
    if (addr.isDefault) {
      const remaining = Array.from(fallbackAddresses.values()).filter((a) => a.userId === userId);
      if (remaining.length > 0) remaining[0].isDefault = true;
    }
    return addr;
  }

  async setDefault(id, userId) {
    if (prisma.address) {
      return prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });

        return tx.address.update({
          where: { id },
          data: { isDefault: true },
        });
      });
    }

    const addr = fallbackAddresses.get(id);
    if (!addr || addr.userId !== userId) return null;
    for (const a of fallbackAddresses.values()) {
      if (a.userId === userId) a.isDefault = false;
    }
    addr.isDefault = true;
    addr.updatedAt = new Date();
    return addr;
  }
}
