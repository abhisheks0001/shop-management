const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const Admin = require("../models/admin");

dotenv.config();

const createAdmin = async(name , email , password) =>{
    const existingAdmin = await Admin.findOne({email});

    if(existingAdmin){
        console.log(`${email} already exists`);
        return;
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    await Admin.create({
        name ,
        email ,
        password: hashedPassword,
        role: "admin"
    });

    console.log(`${email} admin created successfully`);
}

const run = async() => {
    try{
        await connectDB();

        await createAdmin(process.env.ADMIN1_NAME , process.env.ADMIN1_EMAIL , process.env.ADMIN1_PASSWORD); 
        await createAdmin(process.env.ADMIN2_NAME , process.env.ADMIN2_EMAIL , process.env.ADMIN2_PASSWORD);
        
        console.log("admin setup completed");
        process.exit(0);
    } catch(error){
        console.error("Admin setup failed : " ,error.message);
        process.exit(1);
    }
};

run();