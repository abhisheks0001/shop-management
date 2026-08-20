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

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;