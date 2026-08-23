const express = require("express");
const Visit = require("../models/visit");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { visitorId } = req.body;

        if (!visitorId) {
            return res.status(400).json({
                message: "visitorId is required"
            });
        }

        const visit = await Visit.findOneAndUpdate(
            { visitorId },
            {
                $inc: { visitCount: 1 },
                $set: { lastVisitedAt: new Date() }
            },
            {
                new: true,
                upsert: true
            }
        );

        return res.status(200).json({
            message: "Visit recorded",
            visit
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to record visit",
            error: error.message
        });
    }
});

module.exports = router;