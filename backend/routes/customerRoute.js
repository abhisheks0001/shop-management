const express = require("express");
const Customer = require("../models/customer");
const jwt = require("jsonwebtoken");
const customerAuth = require("../middleware/customerAuth");

const router = express.Router();

const captchaStore = new Map();


// ==============================
// START CUSTOMER LOGIN
// ==============================

router.post("/login/start", async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                message: "Name and phone number are required"
            });
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                message: "Enter a valid 10-digit phone number"
            });
        }

        const captcha = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        captchaStore.set(phone, {
            captcha,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        return res.status(200).json({
            message: "CAPTCHA generated successfully",
            captcha
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to generate CAPTCHA",
            error: error.message
        });
    }
});


// ==============================
// VERIFY CUSTOMER LOGIN
// ==============================

router.post("/login/verify", async (req, res) => {
    try {
        const { name, phone, captcha } = req.body;

        if (!name || !phone || !captcha) {
            return res.status(400).json({
                message: "Name, phone and CAPTCHA are required"
            });
        }

        const storedData = captchaStore.get(phone);

        if (!storedData) {
            return res.status(400).json({
                message: "CAPTCHA not found or expired"
            });
        }

        if (Date.now() > storedData.expiresAt) {

            captchaStore.delete(phone);

            return res.status(400).json({
                message: "CAPTCHA expired. Please generate a new one"
            });
        }

        if (captcha !== storedData.captcha) {
            return res.status(401).json({
                message: "Invalid CAPTCHA"
            });
        }

        captchaStore.delete(phone);


        // ==============================
        // FIND OR CREATE CUSTOMER
        // ==============================

        let customer = await Customer.findOne({
            phone
        });

        if (!customer) {

            customer = await Customer.create({
                name,
                phone,
                visitCount: 1,
                firstVisitAt: new Date(),
                lastVisitAt: new Date()
            });

        } else {

            customer.name = name;
            customer.visitCount += 1;
            customer.lastVisitAt = new Date();

            await customer.save();
        }


        // ==============================
        // GENERATE JWT TOKEN
        // ==============================

        const token = jwt.sign(
            {
                id: customer._id,
                role: "customer"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        // ==============================
        // CLEAR ADMIN COOKIE
        // ==============================

        res.clearCookie("adminToken", {
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                "production",
            sameSite:
                process.env.NODE_ENV ===
                "production"
                    ? "none"
                    : "lax"
        });


        // ==============================
        // SET CUSTOMER JWT COOKIE
        // ==============================

        res.cookie(
            "customerToken",
            token,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite:
                    process.env.NODE_ENV ===
                    "production"
                        ? "none"
                        : "lax",

                maxAge:
                    7 *
                    24 *
                    60 *
                    60 *
                    1000
            }
        );


        return res.status(200).json({
            message:
                "Customer login successful",

            customer: {
                id: customer._id,
                name: customer.name,
                phone: customer.phone
            }
        });

    } catch (error) {

        console.error(
            "Customer login error:",
            error
        );

        return res.status(500).json({
            message: "Customer login failed",
            error: error.message
        });
    }
});


// ==============================
// GET LOGGED-IN CUSTOMER
// ==============================

router.get(
    "/me",
    customerAuth,
    async (req, res) => {
        try {

            const customer =
                await Customer.findById(
                    req.customer.id
                ).select("-__v");

            if (!customer) {
                return res.status(404).json({
                    message:
                        "Customer not found"
                });
            }

            return res.status(200).json({
                message:
                    "Customer is logged in",
                customer
            });

        } catch (error) {

            console.error(
                "Get customer error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to get customer",
                error: error.message
            });
        }
    }
);


// ==============================
// CUSTOMER LOGOUT
// ==============================

router.post(
    "/logout",
    customerAuth,
    (req, res) => {

        res.clearCookie(
            "customerToken",
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite:
                    process.env.NODE_ENV ===
                    "production"
                        ? "none"
                        : "lax"
            }
        );

        return res.status(200).json({
            message:
                "Customer logged out successfully"
        });
    }
);


module.exports = router;
