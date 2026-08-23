const express = require("express");
const Visit = require("../models/visit");
const Customer = require("../models/customer");
const Product = require("../models/product");
const adminAuth = require("../middleware/adminAuth");
const DashboardVisit = require("../models/dashboardVisit");

const router = express.Router();

router.get("/stats", adminAuth, async (req, res) => {
    try {
        const totalVisitors = await Visit.countDocuments();
        const dashboardVisits = await DashboardVisit.countDocuments();

        const totalVisits = await Visit.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$visitCount"
                    }
                }
            }
        ]);

        const totalCustomers = await Customer.countDocuments();

        const totalProducts = await Product.countDocuments();

        const mostViewedProducts = await Product.find()
            .sort({ viewCount: -1 })
            .limit(5)
            .select("name price category subCategory images viewCount");

        res.status(200).json({
            totalVisitors,
            totalVisits: totalVisits[0]?.total || 0,
            totalCustomers,
            totalProducts,
            dashboardVisits,
            mostViewedProducts
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
});

router.post("/visit", adminAuth, async (req, res) => {
    try {
        await DashboardVisit.create({
            adminId: req.admin.id
        });

        return res.status(201).json({
            message: "Dashboard visit recorded"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to record dashboard visit",
            error: error.message
        });
    }
});

module.exports = router;