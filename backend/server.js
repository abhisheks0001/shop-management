require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const product = require("./models/product");
const Admin = require("./models/Admin");
const customer = require("./models/customer");
const productRoutes = require("./routes/productroute");
const customerRoutes = require("./routes/customerRoute");
const visitRoutes = require("./routes/visitRoute");
const dashboardRoutes = require("./routes/dashboardRoute"); 

const cookieParser = require("cookie-parser");
const adminRoutes  = require("./routes/adminRoute");



const app = express();

connectDB();

app.use(express.json());

app.use(cookieParser());0
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer" , customerRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT;

app.get("/" , (req,res) =>{
    res.send("backend is running");
});

app.listen(PORT , () => {
    console.log(`Server running on http://localhost:${PORT}`);
});