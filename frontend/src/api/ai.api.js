
import api from "./axios";

// Send a question to the recruiter's AI Hiring Assistant.
export const askHiringAssistant = async (payload) => {
  const response = await api.post(
    "/ai/hiring-assistant",
    payload
  );

  return response.data;
};

// Send a question to the applicant's AI Interview Preparation Assistant.
export const askInterviewPreparation = async (payload) => {
  const response = await api.post(
    "/ai/interview-preparation",
    payload
  );

  return response.data;
};
