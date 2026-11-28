import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { v1Router } from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// HTTP Request Logger
if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Versioned Routes
app.use("/api/v1", v1Router);

// 404 Handler for Unknown Routes
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);
