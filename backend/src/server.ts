import app from "./app.js";

import { env } from "./config/env.js";

import { logger } from "./config/logger.js";

import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

async function startServer(): Promise<void> {
  try {
    // Connect to PostgreSQL
    await connectDatabase();

    logger.info(
      "PostgreSQL database connected successfully"
    );

    // Start Express server
    const server = app.listen(env.PORT, () => {
      logger.info(
        `Taskora API running at http://localhost:${env.PORT}`
      );

      logger.info(
        `Environment: ${env.NODE_ENV}`
      );
    });

    let shuttingDown = false;

    // Graceful shutdown
    const shutdown = (signal: string) => {
      if (shuttingDown) return;

      shuttingDown = true;

      logger.info(
        { signal },
        "Shutting down Taskora API"
      );

      const timeout = setTimeout(() => {
        logger.error("Graceful shutdown timed out");
        process.exit(1);
      }, 10000);

      timeout.unref();

      server.close(async (error) => {
        try {
          await disconnectDatabase();

          logger.info(
            "Database connection closed"
          );

          clearTimeout(timeout);

          process.exit(error ? 1 : 0);
        } catch (shutdownError) {
          logger.error(
            { err: shutdownError },
            "Shutdown failed"
          );

          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("SIGTERM", () => shutdown("SIGTERM"));

    server.on("error", async (error) => {
      logger.fatal(
        { err: error },
        "HTTP server error"
      );

      try {
        await disconnectDatabase();
      } finally {
        process.exit(1);
      }
    });
  } catch (error) {
    logger.fatal(
      { err: error },
      "Failed to start Taskora API"
    );

    try {
      await disconnectDatabase();
    } finally {
      process.exit(1);
    }
  }
}

void startServer();