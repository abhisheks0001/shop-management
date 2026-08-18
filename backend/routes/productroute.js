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

router.get("/" , async(req,res) =>{
    try{
        const products = await Product.find();

        res.status(200).json({
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch Products",
            error: error.message
        });
    }
})

router.get("/:id" , async(req,res) =>{
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            product
        });
    } catch(error) {
        res.status(500).json({
            message: "Failed to fetch Prdouct",
            error : error.message
        });
    }
})

module.exports = router;