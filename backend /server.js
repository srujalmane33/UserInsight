const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/report", reportRoutes);

// Serve static assets from frontend build folder in production
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Fallback routing for SPA to serve index.html
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});