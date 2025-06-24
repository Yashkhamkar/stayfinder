const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/database/mongoose");
const errorHandler = require("./middleware/error/handler");
const routes = require("./routes");
const { port } = require("./config/env");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Connect to MongoDB =====
connectDB();

// ===== API Routes =====
app.use("/api", routes);

// ===== Serve Vite Frontend in Production =====
const clientBuildPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(path.join(clientBuildPath, "index.html"))) {
  app.use(express.static(clientBuildPath));

  // ✅ Fixed fallback route using `{*any}` to avoid path-to-regexp crash
  app.all("/{*any}", (req, res) => {
    const indexPath = path.join(clientBuildPath, "index.html");
    res.sendFile(indexPath);
  });
} else {
  console.warn("⚠️  Vite build not found at:", clientBuildPath);
  console.warn("➡️  Run `npm run build` inside the frontend folder.");
}

// ===== Global Error Handler =====
app.use(errorHandler);

// ===== Start Server =====
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
