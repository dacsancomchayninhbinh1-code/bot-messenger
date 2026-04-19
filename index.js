import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// test server
app.get("/", (req, res) => {
  res.send("OK");
});

// verify webhook
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

// receive message
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const webhook_event = entry.messaging[0];

      if (webhook_event.message && webhook_event.message.text) {
        const sender_id = webhook_event.sender.id;
        const text = webhook_event.message.text;

        // trả lời đơn giản
        await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            recipient: { id: sender_id },
            message: { text: "Bạn vừa nói: " + text }
          })
        });
      }
    }
  }

  res.status(200).send("EVENT_RECEIVED");
});

// chạy server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
