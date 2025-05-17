const bcrypt = require("bcrypt");
const adminModel = require("../Model/admin");
const jwt = require("jsonwebtoken")
// Register admin
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await adminModel.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token  // <-- send the token here
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = {register,login};
