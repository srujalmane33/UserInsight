const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const reportRoutes = require("./routes/reportRoutes");

const app = express();

// 1. Updated CORS handling to allow both your local machine and your Vercel URL
const allowedOrigins = [
  'http://localhost:5173',
  'https://user-insight-five.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy: Origin unauthorized.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Body parsing middleware (Crucial for receiving post parameters)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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