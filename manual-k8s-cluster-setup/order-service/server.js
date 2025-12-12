// order-service/server.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = 8080;
let orders = [];

app.get('/', (r, s) => s.send('🧾 Order Service'));
app.get('/health', (r, s) => s.json({ ok: true }));

app.post('/orders', async (req, res) => {
  const { userId, items } = req.body || {};
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const total = items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
  const orderId = 'ORD-' + Date.now();

  try {
    // Call payment service
    const paymentResp = await axios.post('http://payment-service:8080/payments', { orderId, amount: total });
    const payment = paymentResp.data;

    // Notify user
    await axios.post('http://notification-service:8080/notify', {
      userId,
      message: `✅ Order ${orderId} placed successfully. Total ₹ ${(total / 100).toFixed(2)}`
    });

    const order = { id: orderId, userId, items, total, payment };
    orders.push(order);
    res.json(order);
  } catch (e) {
    console.error('order-service error:', e.message);
    res.status(500).json({ error: 'order failed', message: e.message });
  }
});

app.get('/orders', (r, s) => s.json(orders));

app.listen(PORT, () => console.log('✅ order-service running on', PORT));
