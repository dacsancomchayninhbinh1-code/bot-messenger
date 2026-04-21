app.get("/webhook", (req, res) => {
  console.log("🔥 WEBHOOK HIT");

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("MODE:", mode);
  console.log("TOKEN:", token);
  console.log("CHALLENGE:", challenge);

  if (mode === "subscribe" && token === "abc123") {
    return res.send(challenge);
  }

  return res.sendStatus(403);
});
