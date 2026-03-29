import { Router } from "express";
import healthRouter from "./health.js";
import casesRouter from "./cases.js";
import parseRouter from "./parse.js";

const router = Router();

// ✅ Proper route structure
router.use("/health", healthRouter);
router.use("/cases", casesRouter);
router.use("/parse", parseRouter);

export default router;
