import { z } from "zod";

export const createVendorApplicationSchema = z.object({
  body: z.object({
    storeName: z
      .string({ required_error: "Store name is required" })
      .trim()
      .min(2, "Store name must be at least 2 characters")
      .max(150, "Store name cannot exceed 150 characters"),
    ownerName: z
      .string({ required_error: "Owner / Contact person name is required" })
      .trim()
      .min(2, "Owner name must be at least 2 characters")
      .max(100, "Owner name cannot exceed 100 characters"),
    phone: z
      .string({ required_error: "Mobile phone number is required" })
      .trim()
      .regex(/^\+?[0-9\s-]{7,15}$/, "Phone must contain between 7 and 15 digits"),
    email: z
      .string({ required_error: "Email address is required" })
      .trim()
      .email("Invalid email address"),
    category: z.string().trim().max(100).optional(),
    city: z
      .string({ required_error: "City is required" })
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(100),
    address: z
      .string({ required_error: "Complete shop address is required" })
      .trim()
      .min(5, "Address must be at least 5 characters")
      .max(300, "Address cannot exceed 300 characters"),
    honeypot: z.string().optional(),
    _hp: z.string().optional(),
  }),
});

export const createRiderApplicationSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters"),
    phone: z
      .string({ required_error: "Mobile phone number is required" })
      .trim()
      .regex(/^\+?[0-9\s-]{7,15}$/, "Phone must contain between 7 and 15 digits"),
    email: z
      .string({ required_error: "Email address is required" })
      .trim()
      .email("Invalid email address"),
    city: z
      .string({ required_error: "City is required" })
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(100),
    vehicleType: z
      .string({ required_error: "Vehicle type is required" })
      .trim()
      .min(2)
      .max(50),
    hasLicense: z
      .string({ required_error: "License status is required" })
      .trim()
      .min(2)
      .max(50),
    honeypot: z.string().optional(),
    _hp: z.string().optional(),
  }),
});
