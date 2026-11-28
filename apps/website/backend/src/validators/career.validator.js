import { z } from "zod";

export const createCareerApplicationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100).optional(),
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100).optional(),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email address"),
    phone: z
      .string({ required_error: "Phone number is required" })
      .trim()
      .regex(/^\+?[0-9\s-]{7,15}$/, "Phone must contain between 7 and 15 digits"),
    jobId: z.string().trim().max(100).optional(),
    jobTitle: z.string().trim().max(150).optional(),
    department: z.string().trim().max(100).optional(),
    experience: z.string().trim().max(50).optional(),
    resumeName: z.string().trim().max(255).optional(),
    resumeUrl: z.string().trim().max(1000).optional(),
    coverNote: z.string().trim().max(2000).optional(),
    honeypot: z.string().optional(),
    _hp: z.string().optional(),
  }).refine((data) => data.name || data.fullName, {
    message: "Full name is required",
    path: ["fullName"],
  }),
});

export const getCareerOpeningsQuerySchema = z.object({
  query: z.object({
    department: z.string().trim().optional(),
    q: z.string().trim().optional(),
  }).optional(),
});
