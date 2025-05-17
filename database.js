const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

const URI = process.env.URI

const dbconnection = async () => {
    try {
        await mongoose.connect(URI);
        console.log("database connected successfully")
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}

module.exports = dbconnection;