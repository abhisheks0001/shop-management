const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        visitCount: {
            type: Number,
            default: 0
        },

        firstVisitAt: {
            type: Date,
            default: Date.now
        },

        lastVisitAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema);