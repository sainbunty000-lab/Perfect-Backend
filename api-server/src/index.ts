<<<<<<< HEAD
import "dotenv/config"; // ✅ VERY IMPORTANT

=======
>>>>>>> 52d7754 (final fix)
import app from "./app.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`Server running on port ${PORT}`);
  console.log("DB URL:", process.env.DATABASE_URL); // debug
});
=======
  console.log(`🚀 Server running on port ${PORT}`);
});
>>>>>>> 52d7754 (final fix)
