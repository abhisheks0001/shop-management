const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const product = require("./models/product");
const productRoutes = require("./routes/productroute");

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use("/api/products", productRoutes);

const PORT = process.env.PORT;

app.get("/" , (req,res) =>{
    res.send("backend is running");
});

app.listen(PORT , () => {
    console.log(`Server running on http://localhost:${PORT}`);
});