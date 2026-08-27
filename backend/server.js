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

// Security
app.use(helmet());

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: {
        message: "Too many requests. Please try again later."
    }
});

// Authentication rate limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});

connectDB();

// CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));

app.use(express.json());
app.use(cookieParser());

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("backend is running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});