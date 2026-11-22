// import { z } from "zod";

// export const recruiterJobsQuerySchema = z.object({
//   status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),

//   page: z.coerce.number().int().min(1).default(1),

//   limit: z.coerce.number().int().min(1).max(50).default(10),
// }).strict();

// ----------------------------------------


import { z } from "zod";

export const recruiterJobsQuerySchema = z
  .object({
    status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
     search: z.string().trim().max(100).optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),

    sort: z.enum(["NEWEST", "OLDEST"]).default("NEWEST"),
  })
  .strict();
