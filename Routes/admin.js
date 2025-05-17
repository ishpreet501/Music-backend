const express = require("express");
const { register, login } = require("../Controller/admin"); // ✅ Destructure properly

const adminrouter = express.Router();

adminrouter.post('/register', register); // ✅ function
adminrouter.post('/login', login);       // ✅ function

module.exports = adminrouter;
