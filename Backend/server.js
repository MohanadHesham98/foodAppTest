import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import PromoRouter from "./routes/promoRoute.js";
import userModel from "./models/userModel.js";

// ==========================
// Load ENV
dotenv.config();

// ==========================
// Create Admin
const createAdminIfNotExists = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || !process.env.ADMIN_PASSWORD) {
      console.log("Admin env variables not set");
      return;
    }

    const existingAdmin = await userModel.findOne({
      email: adminEmail,
      role: "admin",
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

      await userModel.create({
        name: process.env.ADMIN_NAME || "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  }
};

// ==========================
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await createAdminIfNotExists(); 
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// ==========================
// App config
const app = express();
const port = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

// Routes
app.use("/api/food", foodRouter);
app.use("/api/auth", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/promo", PromoRouter);

// Static
const __dirname = path.resolve();
app.use("/images", express.static(path.join(__dirname, "uploads")));

// ==========================
// Health Check Endpoints
// ==========================

// Basic health check for ALB
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    service: "backend",
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Backend Server is Awake",
    status: "healthy"
  });
});

// Detailed health check
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  
  res.status(200).json({
    status: "healthy",
    service: "backend",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
