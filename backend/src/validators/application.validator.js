import { z } from "zod";

// Applicant submits an application.
export const createApplicationSchema = z
 
 .object({
    coverLetter: z
      .string()
      .trim()
      .max(3000, "Cover letter cannot exceed 3000 characters.")
      .optional()
      .default(""),
  })
  .strict();

// Recruiter updates application status.
export const updateApplicationStatusSchema = z
  .object({
    status: z.enum(["SHORTLISTED","PENDING", "REJECTED"], {
      error: "Status must be SHORTLISTED or REJECTED or PENDING.",
    }),
  })
  .strict();

// Applicant's application list filters.
export const myApplicationsQuerySchema = z
  .object({
    status: z
      .enum(["PENDING", "SHORTLISTED", "REJECTED", "WITHDRAWN"])
      .optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

// Recruiter's applicant list filters.
export const recruiterApplicationsQuerySchema = z
  .object({
    status: z
      .enum(["PENDING", "SHORTLISTED", "REJECTED", "WITHDRAWN"])
      .optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),

    sort: z
      .enum(["NEWEST", "OLDEST"])
      .default("NEWEST"),
  })
  .strict();