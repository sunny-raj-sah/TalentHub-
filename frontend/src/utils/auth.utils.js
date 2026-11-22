
export const getDashboardPath = (role) => {
  switch (role) {
    case "APPLICANT":
      return "/applicant/dashboard";

    case "RECRUITER":
      return "/recruiter/dashboard";

    default:
      return "/";
  }
};
