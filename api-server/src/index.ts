import "dotenv/config"; // ✅ load env variables

import app from "./app.js";

// ✅ PORT from Railway or fallback
const PORT = process.env.PORT || 8080;

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
console.log("DB URL:", process.env.DATABASE_URL);