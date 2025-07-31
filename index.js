require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const runWeeklyDigest = require("./utils/digestSender");
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📦 Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Error:", err));


const allowed_origins_str = process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173';
const allowedOrigins = allowed_origins_str.split(',');


const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};


app.use(cors(corsOptions)); // Use the cors middleware

const chatbotRoutes = require("./routes/chatbot");
const newsletterRoutes = require("./routes/newsletter"); 

app.use(express.json());

// Routes
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/newsletter", newsletterRoutes); 
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

cron.schedule("0 9 * * 1", () => {
  runWeeklyDigest(); // Every Monday at 9 AM
});
