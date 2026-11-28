import { z } from "zod";

export const createPrescriptionSchema = z.object({
  body: z.object({
    fileName: z
      .string({ required_error: "File name is required" })
      .trim()
      .min(1, "File name cannot be empty")
      .max(255, "File name is too long"),
    fileUrl: z
      .string({ required_error: "File URL is required" })
      .trim()
      .url("File URL must be a valid URL")
      .refine((url) => url.startsWith("https://"), {
        message: "File URL must be a secure HTTPS URL",
      }),
    fileType: z
      .string({ required_error: "File type is required" })
      .trim()
      .toLowerCase()
      .refine((type) => ["jpg", "jpeg", "png", "pdf"].includes(type), {
        message: "Allowed file types are: jpg, jpeg, png, pdf",
      }),
    patientName: z
      .string()
      .trim()
      .max(100, "Patient name cannot exceed 100 characters")
      .optional(),
    doctorName: z
      .string()
      .trim()
      .max(100, "Doctor name cannot exceed 100 characters")
      .optional(),
    notes: z
      .string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters")
      .optional(),
  }),
});

export const prescriptionIdParamSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Prescription ID is required"),
  }),
});
