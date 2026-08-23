const mongoose = require("mongoose");
const categories = require("../config/categories");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            enum: Object.keys(categories),
            trim: true
        },

        subCategory: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                return categories[this.category]?.includes(value);
                },
                message: function (props) {
                return `${props.value} is not a valid subcategory for ${props.instance.category}`;
                }
            },
            trim: true
        },

        brand: {
            type: String,
            trim: true
        },

        images: {
            type: [String],
            default: []
        },

        stockStatus: {
            type: String,
            enum: ["in-stock", "out-of-stock"],
            default: "in-stock"
        },

        featured: {
            type: Boolean,
            default: false
        },
        viewCount: {
            type: Number,
            default: 0
        }
    },
    
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;