import pkg from "pg";

const { Pool } = pkg;

// ✅ Ensure env exists
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Railway
  },
});