const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "abc123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.send(challenge);
  }

  return res.sendStatus(403);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("RUNNING");
});
