const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
});

module.exports = router;