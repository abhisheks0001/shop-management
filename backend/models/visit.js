const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
    {
        visitorId: {
            type: String,
            required: true,
            unique: true
        },

        visitCount: {
            type: Number,
            default: 1
        },

        lastVisitedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Visit", visitSchema);