const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const product = requier("./models/product");

dotenv.config();

const app = express();

connectDB();

const PORT = process.env.PORT;

app.get("/" , (req,res) =>{
    res.send("backend is working");
});

app.listen(PORT , () => {
    console.log(`Server running on http://localhost:${PORT}`);
});