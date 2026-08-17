const mongoose = require("mongoose");

const connectDB = async() => {
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully");
    } catch(error) {
        console.log("some error occured : " , error.message)
        process.exit(1);
    }
};

module.exports = connectDB;