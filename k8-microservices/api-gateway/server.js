// api-gateway/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('🚀 MicroShop API Gateway'));
app.get('/health', (req, res) => res.json({ ok: true }));

// Proxy /api/users -> user-service
app.get('/api/users', async (req, res) => {
  try {
    const r = await axios.get('http://user-service:8080/users');
    res.json(r.data);
  } catch (e) {
    res.status(502).json({ error: 'user-service unreachable' });
  }
});

// Proxy /api/products -> product-service
app.get('/api/products', async (req, res) => {
  try {
    const r = await axios.get('http://product-service:8080/products');
    res.json(r.data);
  } catch (e) {
    res.status(502).json({ error: 'product-service unreachable' });
  }
});

// ✅ New: Proxy order, payment, notification services
app.post('/api/orders', async (req, res) => {
  try {
    const r = await axios.post('http://order-service:8080/orders', req.body);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: 'order-service failed', detail: e.message });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const r = await axios.post('http://payment-service:8080/payments', req.body);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: 'payment-service failed', detail: e.message });
  }
});

app.post('/api/notify', async (req, res) => {
  try {
    const r = await axios.post('http://notification-service:8080/notify', req.body);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: 'notification-service failed', detail: e.message });
  }
});

app.listen(PORT, () => console.log('✅ api-gateway running on', PORT));
