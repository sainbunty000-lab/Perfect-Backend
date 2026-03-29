import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";

import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

// ─────────────────────────────────────────────
// ✅ LOGGER
// ─────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
  })
);

// ─────────────────────────────────────────────
// ✅ MIDDLEWARES
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILES (VERY IMPORTANT for Expo / Railway)
app.use("/public", express.static(path.resolve(process.cwd(), "public")));

// ─────────────────────────────────────────────
// ✅ ROOT (Railway health check)
// ─────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "API running ✅",
  });
});

// ─────────────────────────────────────────────
// ✅ API ROUTES
// ─────────────────────────────────────────────
app.use("/api", router);

// ─────────────────────────────────────────────
// ❌ 404 HANDLER
// ─────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ─────────────────────────────────────────────
// ❌ GLOBAL ERROR HANDLER (IMPROVED)
// ─────────────────────────────────────────────
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  req.log?.error({ err }, "Unhandled error");

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

export default app;
