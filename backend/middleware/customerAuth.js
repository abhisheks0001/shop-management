const jwt = require("jsonwebtoken");

const customerAuth = (req, res, next) => {
    try {
        const token = req.cookies.customerToken;

        if (!token) {
            return res.status(401).json({
                message: "Customer login required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "customer") {
            return res.status(403).json({
                message: "Customer access required"
            });
        }

        req.customer = decoded;

        next();

    } catch (error) {
        console.log("CUSTOMER AUTH ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or expired customer token"
        });
    }
};

module.exports = customerAuth;