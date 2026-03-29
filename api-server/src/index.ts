import "dotenv/config"; // ✅ VERY IMPORTANT

import app from "./app.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("DB URL:", process.env.DATABASE_URL); // debug
});