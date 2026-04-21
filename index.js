import express from "express";
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "abc123";

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/webhook", (req, res) => {
  console.log("🔥 WEBHOOK HIT");

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("MODE:", mode);
  console.log("TOKEN:", token);
  console.log("CHALLENGE:", challenge);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
