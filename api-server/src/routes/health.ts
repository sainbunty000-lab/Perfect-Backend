import { Router } from "express";

const router = Router();

// ✅ Simple health check (no external deps)
router.get("/healthz", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
