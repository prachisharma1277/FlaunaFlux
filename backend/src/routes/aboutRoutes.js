const express = require("express");
const router = express.Router();

// Example: About info (optional)
router.get("/", (req, res) => {
  res.json({
    info: "Welcome to FaunaFlux - Connecting technology and conservation 🌿",
  });
});

// 📬 POST route for Contact form
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Simple validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 👉 For now, just log (you can connect to MongoDB later)
    console.log("📩 New Contact Message:", { name, email, message });

    // Send response back to frontend
    res.json({ success: true, message: "Message received successfully!" });
  } catch (error) {
    console.error("❌ Error in contact route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
