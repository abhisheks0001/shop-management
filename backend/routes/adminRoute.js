const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/login" , async(req, res) =>{
    try{
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(404).json({
                message : "email and password are required"
            });
        }

        const admin = await Admin.findOne({
            email : email.toLowerCase()
        });

        if(!admin){
            return res.status(404).json({
                message:"email or password is invalid"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password , admin.password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Email or Password is invalid"
            });
        }

        const token = jwt.sign(
            {
                id : admin._id,
                role : admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("adminToken", token , {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Admin login successful",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
                }
        });
        } catch (error) {
        return res.status(500).json({
            message: "Admin login failed",
            error: error.message
        });
    }
});


router.get("/me" , adminAuth , async (req,res) =>{
    try{
        const admin = await Admin.findById(req.admin.id).select("-password");

        if(!admin){
            res.status(401).json({
                message: "Admin not found"
            });
        }

        res.status(200).json({
            message:"Admin is Authenticated",
            admin
        });
    } catch(error) {
        res.status(500).json({
            message:"failed to fetch admin",
            error: error.message
        });
    }
});

router.post("/logout" ,adminAuth, (req,res) =>{
    res.clearCookie("adminToken" , {
        httpOnly : true,
        secure : false,
        sameSite  :"lax"
    });

    res.status(200).json({
        message: "Admin Logout successfully"
    });
});

module.exports = router;
