const Subscriber = require("../models/Subscriber");
const { sendDigestEmail } = require("./mailer");

// API-based random verse selector
const getRandomVerse = async () => {
  try {
    const wisdomApiUrl = process.env.WISDOM_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${wisdomApiUrl}/verses/random`);
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    const verse = await response.json();
    return verse;
  } catch (error) {
    console.error("❌ Failed to fetch random verse from API:", error);
    return null;
  }
};

const runWeeklyDigest = async () => {
  console.log("📩 Starting Weekly Digest Job...");
  try {
    const subs = await Subscriber.find({});
    if (!subs.length) return console.log("❌ No subscribers found.");

    const verse = await getRandomVerse();
    if (!verse) {
      console.error("❌ No verse fetched from API, skipping digest.");
      return;
    }
    console.log("📖 Verse Picked from API:", verse);

    // ✨ UPDATED: Use verse_number for a cleaner subject
    const subject = `🧘 Weekly Wisdom: Verse ${verse.verse_number}`;
    
    const html = `
      <div style="max-width:600px; margin:auto; background:#fffdf5 url('https://cdn.pixabay.com/photo/2017/04/09/16/20/meditation-2210452_1280.jpg') no-repeat center top; background-size: cover; padding:30px; font-family:Georgia, serif; border:1px solid #e5e5e5; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        <div style="background-color: rgba(255, 255, 255, 0.95); padding: 20px; border-radius: 8px;">
          <h2 style="text-align:center; color:#7b3f00;">🧘‍♂️ Wisdom of Ashtavakra</h2>
          <h3 style="text-align:center; color:#444;">📖 Verse ${verse.verse_number}</h3>
          <hr style="border:none; border-top:1px solid #ccc; margin:20px 0;">
          <p style="font-size:18px;"><strong>🕉️ Sanskrit:</strong><br><span style="font-size:20px; color:#222;">${verse.sanskrit}</span></p>
          <p style="font-size:16px;"><strong>🔤 Transliteration:</strong><br><em style="color:#444;">${verse.transliteration}</em></p>
          <p style="font-size:16px;"><strong>🌐 Translation:</strong><br><span style="color:#222;">${verse.english}</span></p>
          <p style="font-size:16px;"><strong>🧠 Commentary:</strong><br><span style="color:#555;">${verse.commentary}</span></p>
          <div style="text-align:center; margin-top:30px;">
            <a href="https://yourdomain.com/verse/${verse.verse_number}" 
              style="background:#7b3f00; color:white; padding:12px 20px; border-radius:6px; text-decoration:none; font-size:16px;">
              🔗 Open in App
            </a>
          </div>
          <hr style="border:none; border-top:1px dashed #aaa; margin:30px 0;">
          <p style="font-size:14px; text-align:center; color:#888;">
            You are receiving this as part of your weekly spiritual newsletter from <strong>Wisdom of Ashtavakra</strong>.<br>
            Want to unsubscribe? Contact us at thesky9474@gmail.com
          </p>
        </div>
      </div>
    `;

    for (const sub of subs) {
      await sendDigestEmail(sub.email, subject, html);
      console.log(`✅ Sent digest to ${sub.email}`);
    }

  } catch (err) {
    console.error("❌ Weekly Digest Error:", err);
  }
};

module.exports = runWeeklyDigest;