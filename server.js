const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Referral System API");
});

const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
