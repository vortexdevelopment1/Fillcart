import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";
import { careerOpenings } from "../data/careerOpeningsData.js";

export class CareerRepository {
  findOpenings({ department, q } = {}) {
    let list = [...careerOpenings];

    if (department && department !== "All") {
      list = list.filter(
        (job) => job.department.toLowerCase() === department.toLowerCase()
      );
    }

    if (q) {
      const query = q.toLowerCase();
      list = list.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.department.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    return list;
  }

  async createApplication({
    fullName,
    email,
    phone,
    jobTitle,
    department,
    experience,
    resumeName,
    resumeUrl,
    coverNote,
  }) {
    if (prisma.careerApplication) {
      return prisma.careerApplication.create({
        data: {
          fullName,
          email,
          phone,
          jobTitle: jobTitle || null,
          department: department || null,
          experience: experience || null,
          resumeName: resumeName || null,
          resumeUrl: resumeUrl || null,
          coverNote: coverNote || null,
          status: "NEW",
        },
      });
    }

    // Graceful in-memory fallback if migration/generate not yet run
    return {
      id: randomUUID(),
      fullName,
      email,
      phone,
      jobTitle: jobTitle || null,
      department: department || null,
      experience: experience || null,
      resumeName: resumeName || null,
      resumeUrl: resumeUrl || null,
      coverNote: coverNote || null,
      status: "NEW",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
