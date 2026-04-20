import express from "express";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "abc123";

// test server
app.get("/", (req, res) => {
  res.send("OK");
});

// verify webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// receive message
app.post("/webhook", (req, res) => {
  console.log("Message received:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
