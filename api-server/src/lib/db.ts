import pkg from "pg";

const { Pool } = pkg;

<<<<<<< HEAD
// ✅ Fix TypeScript env issue
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("❌ DATABASE_URL missing");
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
=======
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ✅ Required for Railway
>>>>>>> 52d7754 (final fix)
  },
});