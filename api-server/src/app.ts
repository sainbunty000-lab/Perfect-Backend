<<<<<<< HEAD
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
=======
import express, { type Express, type Request, type Response, type NextFunction } from "express";
>>>>>>> 52d7754 (final fix)
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

<<<<<<< HEAD
// ─────────────────────────────────────────────
// ✅ STATIC FILES (Expo / assets)
// ─────────────────────────────────────────────
=======
// ✅ STATIC FILES (VERY IMPORTANT for Expo / Railway)
>>>>>>> 52d7754 (final fix)
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
<<<<<<< HEAD
// ❌ 404 HANDLER (keep AFTER routes)
=======
// ❌ 404 HANDLER
>>>>>>> 52d7754 (final fix)
// ─────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ─────────────────────────────────────────────
<<<<<<< HEAD
// ❌ GLOBAL ERROR HANDLER (FINAL)
// ─────────────────────────────────────────────
app.use(
  (err: any, req: Request, res: Response, _next: NextFunction) => {
    req.log?.error({ err }, "Unhandled error");

    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  }
);

export default app;
=======
// ❌ GLOBAL ERROR HANDLER (IMPROVED)
// ─────────────────────────────────────────────
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  req.log?.error({ err }, "Unhandled error");

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

export default app;
>>>>>>> 52d7754 (final fix)
