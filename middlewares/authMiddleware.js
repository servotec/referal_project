const jwt = require("jsonwebtoken");

const requireSignIn = (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (err) {
    res.status(401).send({ success: false, message: "Unauthorized" });
  }
};

module.exports = requireSignIn;
