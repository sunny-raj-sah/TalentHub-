 
import {
  hiringAssistantSchema,
  interviewPreparationSchema,
} from "../validators/ai.validator.js";

import {
  generateHiringAssistantResponse,
  generateInterviewPreparationResponse,
} from "../services/ai.service.js";

export const hiringAssistant = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = hiringAssistantSchema.parse(req.body);

    const { jobId, question, history } = validatedData;

    // 2. Generate AI response for authenticated recruiter
    const result = await generateHiringAssistantResponse(
      req.user.id,
      jobId,
      question,
      history
    );

    // 3. Return standardized API response
    return res.status(200).json({
      success: true,
      message: "AI response generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const interviewPreparation = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = interviewPreparationSchema.parse(req.body);

    const { jobId, question, history } = validatedData;

    // 2. Generate personalized interview preparation response
    const result = await generateInterviewPreparationResponse(
      req.user.id,
      jobId,
      question,
      history
    );

    // 3. Return standardized API response
    return res.status(200).json({
      success: true,
      message: "Interview preparation response generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
