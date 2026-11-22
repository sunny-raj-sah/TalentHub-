 
// import { z } from "zod";

// const conversationMessageSchema = z
//   .object({
//     role: z.enum(["user", "assistant"]),
//     content: z
//       .string()
//       .trim()
//       .min(1, "Message content cannot be empty.")
//       .max(2000, "Message cannot exceed 2000 characters."),
//   })
//   .strict();

// const conversationHistorySchema = z
//   .array(conversationMessageSchema)
//   .max(10, "Conversation history cannot exceed 10 messages.")
//   .optional()
//   .default([]);

// const createAISchema = () =>
//   z
//     .object({
//       jobId: z
//         .string()
//         .trim()
//         .min(1, "Job ID is required.")
//         .regex(/^[0-9a-fA-F]{24}$/, "Invalid job ID."),

//       question: z
//         .string()
//         .trim()
//         .min(1, "Question cannot be empty.")
//         .max(12000, "Question cannot exceed 12000 characters."),

//       history: conversationHistorySchema,
//     })
//     .strict();

// export const hiringAssistantSchema = createAISchema();

// export const interviewPreparationSchema = createAISchema();
// --------------------------------------------------------------------------------------


import { z } from "zod";

const conversationMessageSchema = z.discriminatedUnion("role", [
  z
    .object({
      role: z.literal("user"),
      content: z
        .string()
        .trim()
        .min(1, "Message content cannot be empty.")
        .max(2000, "User message cannot exceed 2000 characters."),
    })
    .strict(),

  z
    .object({
      role: z.literal("assistant"),
      content: z
        .string()
        .trim()
        .min(1, "Message content cannot be empty.")
        .max(12000, "Assistant response cannot exceed 12000 characters."),
    })
    .strict(),
]);

const conversationHistorySchema = z
  .array(conversationMessageSchema)
  .max(10, "Conversation history cannot exceed 10 messages.")
  .optional()
  .default([]);

const createAISchema = () =>
  z
    .object({
      jobId: z
        .string()
        .trim()
        .min(1, "Job ID is required.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid job ID."),

      question: z
        .string()
        .trim()
        .min(1, "Question cannot be empty.")
        .max(2000, "Question cannot exceed 2000 characters."),

      history: conversationHistorySchema,
    })
    .strict();

export const hiringAssistantSchema = createAISchema();

export const interviewPreparationSchema = createAISchema();
