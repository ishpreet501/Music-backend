const mongoose = require("mongoose");
const dns = require("dns");
const dotenv = require("dotenv");
dotenv.config();

// Fix for querySrv EBADRESP issue on Windows / ISP DNS
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.warn("Failed to set custom DNS servers:", error.message);
}

const URI = process.env.URI;

const dbconnection = async () => {
  try {
    await mongoose.connect(URI);
    console.log("database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

module.exports = dbconnection;