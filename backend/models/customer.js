const jwt = require("jsonwebtoken");

const adminAuth = (req, res , next ) =>{
    try{

        const Admin = req.cookies.adminToken;

        if(!token){
            res.status(401).json({
                message: "Admin Authentication required"
            });
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        
        if(decoded.role!== "admin"){
            res.status(403).json({
                message: "Admin access required"
            });
        }

        req.Admin = decoded;

        next();
    } catch(error) {
        return res.status(401).json({
            message : "Invalid or expired admin token"
        });
    }
}

module.exports = adminAuth;