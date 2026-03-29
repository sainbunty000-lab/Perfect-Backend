import { Router } from "express";
import { pool } from "../lib/pool.js";

const router = Router();

// ─────────────────────────────────────────────
// ✅ INIT DB (RUN ONCE IN BROWSER)
// ─────────────────────────────────────────────
router.get("/init-db", async (_req, res) => {
  try {
    console.log("🔥 INIT DB HIT"); // ✅ helps confirm deploy

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cases (
        id SERIAL PRIMARY KEY,
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    res.json({ status: "DB ready ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB init failed" });
  }
});

// ─────────────────────────────────────────────
// ✅ GET ALL CASES
// ─────────────────────────────────────────────
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cases ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// ─────────────────────────────────────────────
// ✅ CREATE CASE
// ─────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO cases (data) VALUES ($1) RETURNING *",
      [req.body]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// ─────────────────────────────────────────────
// ✅ GET BY ID (STRICT NUMBER ONLY)
// ─────────────────────────────────────────────
router.get("/:id(\\d+)", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "SELECT * FROM cases WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// ─────────────────────────────────────────────
// ✅ UPDATE CASE
// ─────────────────────────────────────────────
router.put("/:id(\\d+)", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      `UPDATE cases 
       SET data = $1, updated_at = NOW()
       WHERE id = $2 
       RETURNING *`,
      [req.body, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// ─────────────────────────────────────────────
// ✅ DELETE CASE
// ─────────────────────────────────────────────
router.delete("/:id(\\d+)", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "DELETE FROM cases WHERE id = $1 RETURNING *",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
