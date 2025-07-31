const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const { sendConfirmationEmail } = require("../utils/mailer");

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ error: "Already subscribed." });

    const newSub = new Subscriber({ email });
    await newSub.save();

    await sendConfirmationEmail(email); // ✅ Send confirmation
    console.log("✅ Confirmation sent to", email);

    res.json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error("❌ Subscription error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
