import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ===== VERIFY WEBHOOK =====
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// ===== RECEIVE MESSAGE =====
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const webhook_event = entry.messaging[0];

      if (webhook_event.message && webhook_event.message.text) {
        const sender_id = webhook_event.sender.id;
        const text = webhook_event.message.text;

        try {
          // ===== CALL OPENAI =====
          const ai = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content:
                      "Bạn là nhân viên bán cơm cháy Ninh Bình, nói chuyện thân thiện, chốt đơn khéo.",
                  },
                  { role: "user", content: text },
                ],
              }),
            }
          );

          const data = await ai.json();
          const reply =
            data.choices?.[0]?.message?.content || "Xin lỗi, tôi chưa hiểu.";

          // ===== SEND BACK TO FACEBOOK =====
          await fetch(
            `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                recipient: { id: sender_id },
                message: { text: reply },
              }),
            }
          );
        } catch (err) {
          console.error("ERROR:", err);
        }
      }
    }
    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
