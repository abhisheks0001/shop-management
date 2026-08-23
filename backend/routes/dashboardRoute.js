const express = require("express");
const Visit = require("../models/visit");
const Customer = require("../models/customer");
const Product = require("../models/product");
const adminAuth = require("../middleware/adminAuth");
const DashboardVisit = require("../models/dashboardVisit");
const CategoryView = require("../models/categoryView");
const ProductView = require("../models/productView");

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

            const mostViewedCategories = await CategoryView.find()
            .sort({ viewCount: -1 })
            .limit(5);

            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);

            const todayVisitors = await Visit.countDocuments({
                createdAt: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            });

            const activeVisitorsToday = await Visit.countDocuments({
                lastVisitedAt: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            });

            const customersLoggedInToday = await Customer.countDocuments({
                lastLoginAt: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            });

            const productViewsToday = await ProductView.countDocuments({
                createdAt: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            });

        return res.status(200).json({
            totalVisitors,
            totalVisits: totalVisits[0]?.total || 0,
            totalCustomers,
            totalProducts,
            dashboardVisits,

            todayVisitors,
            activeVisitorsToday,
            customersLoggedInToday,
            productViewsToday,

            mostViewedProducts,
            mostViewedCategories
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