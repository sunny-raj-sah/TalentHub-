
import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Please enter a valid URL")
  .or(z.literal(""));

const experienceSchema = z
  .object({
    jobTitle: z.string().trim().max(100).optional(),
    company: z.string().trim().max(100).optional(),
    employmentType: z
      .enum([
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT",
        "FREELANCE",
      ])
      .optional(),
    location: z.string().trim().max(100).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    currentlyWorking: z.boolean().optional(),
    description: z.string().trim().max(2000).optional(),
  })
  .strict();

const educationSchema = z
  .object({
    institution: z.string().trim().max(150).optional(),
    degree: z.string().trim().max(100).optional(),
    fieldOfStudy: z.string().trim().max(100).optional(),
    startYear: z.number().int().min(1950).max(2100).optional(),
    endYear: z.number().int().min(1950).max(2100).optional(),
    description: z.string().trim().max(1000).optional(),
  })
  .strict();

export const applicantProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    photoUrl: optionalUrl.optional(),
    bio: z.string().trim().max(1000).optional(),
    experience: z.array(experienceSchema).max(20).optional(),
    education: z.array(educationSchema).max(20).optional(),
    skills: z
      .array(z.string().trim().min(1).max(50))
      .max(50)
      .optional(),
    resumeUrl: optionalUrl.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const recruiterProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    companyName: z.string().trim().max(150).optional(),
    companyLogoUrl: optionalUrl.optional(),
    website: optionalUrl.optional(),
    aboutCompany: z.string().trim().max(2000).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
