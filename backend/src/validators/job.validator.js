
import { z } from "zod";

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
  "FREELANCE",
];

const workModes = ["REMOTE", "ONSITE", "HYBRID"];

const salarySchema = z
  .object({
    min: z.number().positive("Minimum salary must be greater than 0"),
    max: z.number().positive("Maximum salary must be greater than 0"),
    currency: z
      .string()
      .trim()
      .length(3, "Currency must be a 3-letter code")
      .toUpperCase()
      .default("INR"),
  })
  .strict()
  .refine((salary) => salary.min <= salary.max, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["max"],
  });

const experienceSchema = z
  .object({
    min: z.number().min(0, "Minimum experience cannot be negative"),
    max: z.number().min(0, "Maximum experience cannot be negative"),
  })
  .strict()
  .refine((experience) => experience.min <= experience.max, {
    message: "Maximum experience must be greater than or equal to minimum experience",
    path: ["max"],
  });

const jobFields = {
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(30).max(10000),
  skills: z
    .array(z.string().trim().min(1).max(50))
    .min(1, "At least one skill is required")
    .max(30),
  salary: salarySchema,
  experience: experienceSchema,
  location: z.string().trim().min(2).max(150),
  employmentType: z.enum(employmentTypes),
  workMode: z.enum(workModes),
  applicationDeadline: z.coerce.date().refine(
    (date) => date.getTime() > Date.now(),
    "Application deadline must be in the future"
  ),
};

export const createJobSchema = z
  .object(jobFields)
  .strict();

export const updateJobSchema = z
  .object(jobFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
