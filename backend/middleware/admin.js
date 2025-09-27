// middleware/admin.js
const admin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    console.error("Admin middleware error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = admin;
