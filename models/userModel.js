const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: String,
  email: { type: String, unique: true },
  password: String,
  address: String,
  phone: String,
  referralCode: String,
  referredBy: String,
  referrals: [String],
  earnings: {
    direct: { type: Number, default: 0 },
    indirect: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
