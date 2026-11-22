 
// const errorHandler = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;

//   const message =
//     statusCode === 500 && process.env.NODE_ENV === "production"
//       ? "Internal server error"
//       : err.message || "Something went wrong";

//   if (statusCode >= 500) {
//     console.error(err);
//   }

//   return res.status(statusCode).json({
//     success: false,
//     message,
//     errors: err.errors || [],
//   });
// };

// export default errorHandler;

// ----------------------------

import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors || [];

  // Handle Zod validation errors.
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed.";

    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Handle MongoDB duplicate key errors.
  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists.";
    errors = Object.keys(err.keyValue || {}).map((field) => ({
      field,
      message: `${field} already exists.`,
    }));
  }

  // Hide internal error details in production.
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default errorHandler;
