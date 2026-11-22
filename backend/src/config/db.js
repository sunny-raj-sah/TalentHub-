
// import mongoose from "mongoose";
// import { env } from "./env.js";

// const connectDB = async () => {
//   try {
//     const connection = await mongoose.connect(env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 10000,
//     });

//     console.log(
//       `MongoDB connected: ${connection.connection.host}`
//     );

//     return connection;
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     throw error;
//   }
// };

// export default connectDB;
// -------------------------------------

import mongoose from "mongoose";
import { env } from "./env.js";

let connectionPromise = null;

const connectDB = async () => {
  // Reuse an already established connection.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Reuse an ongoing connection attempt.
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then((connection) => {
        console.log(
          `MongoDB connected: ${connection.connection.host}`
        );

        return connection.connection;
      })
      .catch((error) => {
        connectionPromise = null;

        console.error(
          "MongoDB connection failed:",
          error.message
        );

        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;
