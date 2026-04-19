console.log("🔥 BOT ĐANG CHẠY FILE INDEX.JS");
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
    console.log("webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// receive message
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
});

// start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
