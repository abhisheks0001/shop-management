const express = require("express");
const Product = require("../models/product");
const categories = require("../config/categories");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const getPublicIdFromUrl = (url) => {
    const parts = url.split("/upload/");

    if (parts.length !== 2) {
        return null;
    }

    let publicId = parts[1];

    // Remove version, e.g. v123456789/
    publicId = publicId.replace(/^v\d+\//, "");

    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, "");

    return publicId;
};

router.get("/", async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
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

router.post("/", adminAuth, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            subCategory,
            brand,
            images,
            stockStatus,
            featured
        } = req.body;

        // Required fields
        if (!name || !category || !subCategory || price === undefined) {
            return res.status(400).json({
                message: "Name, category, subcategory and price are required"
            });
        }

        // Check category
        if (!categories[category]) {
            return res.status(400).json({
                message: "Invalid category"
            });
        }

        // Check subcategory
        if (!categories[category].includes(subCategory)) {
            return res.status(400).json({
                message: `Invalid subcategory '${subCategory}' for category '${category}'`
            });
        }

        // Check price
        if (price < 0) {
            return res.status(400).json({
                message: "Price cannot be negative"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            subCategory,
            brand,
            images,
            stockStatus,
            featured
        });

        return res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
});


router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params;

        // Check whether category exists
        if (!categories[category]) {
            return res.status(400).json({
                message: "Invalid category"
            });
        }

        const products = await Product.find({
            category: category
        });

        res.status(200).json({
            category,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch category products",
            error: error.message
        });
    }
});

router.get(
    "/category/:category/:subCategory",
    async (req, res) => {
        try {
            const { category, subCategory } = req.params;

            // Check category
            if (!categories[category]) {
                return res.status(400).json({
                    message: "Invalid category"
                });
            }

            // Check subcategory belongs to category
            if (!categories[category].includes(subCategory)) {
                return res.status(400).json({
                    message: `Invalid subcategory '${subCategory}' for category '${category}'`
                });
            }

            const products = await Product.find({
                category,
                subCategory
            });

            res.status(200).json({
                category,
                subCategory,
                count: products.length,
                products
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch products",
                error: error.message
            });
        }
    }
);

router.post(
    "/upload-image",
    adminAuth,
    upload.array("images", 5),
    async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: "At least one image is required"
                });
            }

            const imageUrls = [];

            for (const file of req.files) {
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "shop-products"
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );

                    stream.end(file.buffer);
                });

                imageUrls.push(uploadResult.secure_url);
            }

            return res.status(200).json({
                message: "Images uploaded successfully",
                imageUrls
            });

        } catch (error) {
            return res.status(500).json({
                message: "Failed to upload images",
                error: error.message
            });
        }
    }
);


router.get("/:id" , async(req,res) => {
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $inc: {
                    viewCount: 1
                }
            },
            {
                new: true
            }
        );

        if(!product){
            return res.status(400).json({
                message : "product does not exist"
            });
        }

        const relatedProducts = await Product.find({
            _id : {$ne:product._id},
            category : product.category,
            subCategory: product.subCategory          
        }).limit(6);

        res.status(200).json({
            product,
            relatedProducts
        });
    } catch (error) {
        res.status(500).json({
            message: "failed to fetch product",
            error: error.message
        });
    }
});

router.put("/:id", adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const oldImages = product.images || [];
        const newImages = req.body.images;

        // If new images are provided, delete old images from Cloudinary
        if (newImages && Array.isArray(newImages)) {
            for (const imageUrl of oldImages) {
                const publicId = getPublicIdFromUrl(imageUrl);

                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
});

router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                const publicId = getPublicIdFromUrl(imageUrl);

                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
        }

        // Delete product from MongoDB
        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Product and its images deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
});

module.exports = router;