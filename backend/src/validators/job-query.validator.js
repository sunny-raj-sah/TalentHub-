
import { z } from "zod";

const optionalNumber = z
  .string()
  .optional()
  .transform((value) => {
    if (value === undefined || value === "") return undefined;
    return Number(value);
  })
  .pipe(z.number().finite().nonnegative().optional());

export const jobQuerySchema = z
  .object({
    search: z.string().trim().max(100).optional(),
    location: z.string().trim().max(150).optional(),

    employmentType: z
      .enum([
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT",
        "FREELANCE",
      ])
      .optional(),

    workMode: z
      .enum(["REMOTE", "ONSITE", "HYBRID"])
      .optional(),

    minSalary: optionalNumber,
    maxSalary: optionalNumber,
    minExperience: optionalNumber,
    maxExperience: optionalNumber,

    sort: z
      .enum(["NEWEST", "OLDEST", "SALARY_LOW", "SALARY_HIGH"])
      .default("NEWEST"),

    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict()
  .refine(
    (data) =>
      data.minSalary === undefined ||
      data.maxSalary === undefined ||
      data.minSalary <= data.maxSalary,
    {
      message: "Minimum salary cannot exceed maximum salary",
      path: ["maxSalary"],
    }
  )
  .refine(
    (data) =>
      data.minExperience === undefined ||
      data.maxExperience === undefined ||
      data.minExperience <= data.maxExperience,
    {
      message: "Minimum experience cannot exceed maximum experience",
      path: ["maxExperience"],
    }
  );
