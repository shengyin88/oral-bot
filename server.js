const express = require('express');
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "oral_bot_123";

// ✅ Webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Receive messages
app.post('/webhook', (req, res) => {
  console.log("Incoming message:");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

// ✅ IMPORTANT: Render port fix
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
