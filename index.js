import express from "express";

const app = express();

// test
app.get("/", (req, res) => {
  res.send("OK");
});

// verify webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "abc123"; // fix cứng luôn cho chắc

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.send(challenge);
  } else {
    return res.send("Sai token");
  }
});

// chạy server
app.listen(10000, () => {
  console.log("Server chạy rồi");
});
