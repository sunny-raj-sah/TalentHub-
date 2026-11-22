
import { z } from "zod";

const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(80, "Name cannot exceed 80 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address")
      .max(254, "Email cannot exceed 254 characters"),

    password: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(72, "Password cannot exceed 72 characters"),
  })
  .strict();



export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address")
      .max(254, "Email cannot exceed 254 characters"),

    password: z
      .string()
      .min(6, "Password is required")
      .max(72, "Password cannot exceed 72 characters"),
  })
  .strict();

export const applicantRegistrationSchema = registrationSchema;

export const recruiterRegistrationSchema = registrationSchema;
