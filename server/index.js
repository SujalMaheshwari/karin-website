import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`KARIN backend running -> http://localhost:${PORT}`);
      console.log(`Health check -> http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
