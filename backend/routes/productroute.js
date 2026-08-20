const express = require("express");
const Product = require("../models/product");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

router.post("/", adminAuth, async (req, res) => {
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

router.get("/category/:category" , async(req,res) =>{
    try{
        const products = await Product.find({
            category: req.params.category
        });

        res.status(200).json({
            category : req.params.category,
            count : products.length,
            products
        });
    } catch(error) {
        res.status(500).json({
            message: "Failed to fetch category products",
            error : error.message
        });
    }
})

router.get("/category/:category/:subCategory", async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.category,
            subCategory: req.params.subCategory
        });

        res.status(200).json({
            category: req.params.category,
            subCategory: req.params.subCategory,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});

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

router.put("/:id", adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
});

router.delete("/:id" ,adminAuth, async(req, res) =>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            res.status(200).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted Successfully",
            product
        });
    } catch(error){
        res.status(500).json({
            message : "Failed to delete prodcut",
            error: error.message
        });
    }
})

module.exports = router;