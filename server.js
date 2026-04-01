const express = require('express');
const app = express();

app.use(express.json());
const users = {};

const VERIFY_TOKEN = "oral_bot_123";

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

app.post('/webhook', async (req, res) => {
  console.log("FULL BODY:", JSON.stringify(req.body, null, 2));

  try {
    const message = req.body.entry[0].changes[0].value.messages[0];
    const from = message.from;

    console.log("Message from:", from);

    await sendMessage(from, "Hello! I got your message 👍");

  } catch (err) {
    console.log("ERROR:", err.message);
  }

  res.sendStatus(200);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


async function sendMessage(to, text) {
  const fetch = require("node-fetch");

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text }
      })
    });

    const data = await res.text();
    console.log("SEND RESPONSE:", data);

  } catch (err) {
    console.log("SEND ERROR:", err.message);
  }
}