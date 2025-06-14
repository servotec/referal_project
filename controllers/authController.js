const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerController = async (req, res) => {
  try {
    const { userName, email, password, phone, address, referredBy } = req.body;
    if (!userName || !email || !password || !phone || !address) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = Math.random().toString(36).substring(2, 8);

    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      address,
      phone,
      referredBy,
      referralCode
    });

    // Update parent referrals
    if (referredBy) {
      const parent = await userModel.findOne({ referralCode: referredBy });
      if (parent && parent.referrals.length < 8) {
        parent.referrals.push(user._id);
        await parent.save();
      }
    }

    res.status(201).send({ success: true, message: "User registered", user });
  } catch (err) {
    res.status(500).send({ success: false, message: "Register failed", error: err.message });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).send({ success: true, token, user });
  } catch (err) {
    res.status(500).send({ success: false, message: "Login failed", error: err.message });
  }
};

module.exports = { registerController, loginController };
