import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    label: z.string().trim().max(50).default("Home"),
    fullName: z
      .string({ required_error: "Full name is required" })
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100),
    phone: z
      .string({ required_error: "Phone number is required" })
      .trim()
      .regex(/^\+?[0-9\s-]{7,15}$/, "Phone must contain between 7 and 15 digits"),
    line1: z
      .string({ required_error: "Address line 1 is required" })
      .trim()
      .min(5, "Address line 1 must be at least 5 characters")
      .max(255),
    line2: z.string().trim().max(255).optional().or(z.literal("")),
    landmark: z.string().trim().max(150).optional().or(z.literal("")),
    city: z
      .string({ required_error: "City is required" })
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(100),
    state: z
      .string({ required_error: "State is required" })
      .trim()
      .min(2, "State must be at least 2 characters")
      .max(100),
    pincode: z
      .string({ required_error: "Pincode is required" })
      .trim()
      .regex(/^[0-9]{6}$/, "Pincode must be a 6-digit postal code"),
    isDefault: z.boolean().optional().default(false),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Address ID is required"),
  }),
  body: z.object({
    label: z.string().trim().max(50).optional(),
    fullName: z.string().trim().min(2).max(100).optional(),
    phone: z.string().trim().regex(/^\+?[0-9\s-]{7,15}$/).optional(),
    line1: z.string().trim().min(5).max(255).optional(),
    line2: z.string().trim().max(255).optional().or(z.literal("")),
    landmark: z.string().trim().max(150).optional().or(z.literal("")),
    city: z.string().trim().min(2).max(100).optional(),
    state: z.string().trim().min(2).max(100).optional(),
    pincode: z.string().trim().regex(/^[0-9]{6}$/).optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const addressIdParamSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Address ID is required"),
  }),
});
