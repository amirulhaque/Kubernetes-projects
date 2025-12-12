// notification-service/server.js
const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.get('/', (r, s) => s.send('🔔 Notification Service'));
app.get('/health', (r, s) => s.json({ ok: true }));

app.post('/notify', (req, res) => {
  const { userId, message } = req.body || {};
  if (!userId || !message) return res.status(400).json({ error: 'Invalid notification request' });
  console.log(`📩 Notification to ${userId}: ${message}`);
  res.json({ userId, message, status: 'SENT' });
});

app.listen(PORT, () => console.log('✅ notification-service running on', PORT));
