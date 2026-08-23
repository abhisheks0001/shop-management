const mongoose = require("mongoose");

const categoryViewSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true
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

module.exports = mongoose.model("CategoryView", categoryViewSchema);