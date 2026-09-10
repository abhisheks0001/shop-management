require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productroute");
const customerRoutes = require("./routes/customerRoute");
const visitRoutes = require("./routes/visitRoute");
const dashboardRoutes = require("./routes/dashboardRoute");
const adminRoutes = require("./routes/adminRoute");

const app = express();


// Security Middleware
app.use(helmet());


// Rate Limiter for general APIs
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: {
        message: "Too many requests. Please try again later."
    }
});


// Rate Limiter for authentication APIs
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});


// Connect MongoDB
connectDB();


// CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// Middleware
app.use(express.json());
app.use(cookieParser());


// General API Rate Limiting
app.use("/api", apiLimiter);


// Routes
app.use("/api/products", productRoutes);

app.use("/api/admin", authLimiter, adminRoutes);

app.use("/api/customer", customerRoutes);

app.use("/api/visits", visitRoutes);

app.use("/api/dashboard", dashboardRoutes);


// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Shop Management API is running"
    });
});


// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});