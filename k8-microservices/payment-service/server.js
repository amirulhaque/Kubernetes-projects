// payment-service/server.js
const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.get('/', (r, s) => s.send('💳 Payment Service'));
app.get('/health', (r, s) => s.json({ ok: true }));

app.post('/payments', (req, res) => {
  const { orderId, amount } = req.body || {};
  if (!orderId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid payment request' });
  }
  const txId = 'TX-' + Date.now();
  console.log(`✅ Payment processed for ${orderId}, ₹ ${(amount / 100).toFixed(2)}`);
  res.json({ orderId, amount, status: 'PAID', txId });
});

app.listen(PORT, () => console.log('✅ payment-service running on', PORT));
