
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    // Connect database before starting server
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(
        `TalentHub server running on port ${env.PORT}`
      );

      console.log(
        `Environment: ${env.NODE_ENV}`
      );
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);

    //   server.close(async () => {
    //     await import("mongoose").then(({ default: mongoose }) =>
    //       mongoose.disconnect()
    //     );

    //     console.log("Server and database disconnected");
    //     process.exit(0);
    //   });
server.close(async () => {
  await mongoose.disconnect();

  console.log("Server and database disconnected");
  process.exit(0);
});    
};

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start TalentHub:", error.message);
    process.exit(1);
  }
};

startServer();
