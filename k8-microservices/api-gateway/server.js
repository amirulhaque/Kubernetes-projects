const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('🚀 MicroShop API Gateway'));
app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/api/users', async (req, res) => {
  const r = await axios.get('http://user-service:8080/users').catch(e => null);
  if (!r) return res.status(502).json({ error: 'user-service unreachable' });
  res.json(r.data);
});

app.get('/api/products', async (req, res) => {
  const r = await axios.get('http://product-service:8080/products').catch(e => null);
  if (!r) return res.status(502).json({ error: 'product-service unreachable' });
  res.json(r.data);
});

app.post('/api/checkout', async (req, res) => {
  try {
    const r = await axios.post('http://order-service:8080/order', req.body);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: 'checkout failed' });
  }
});

app.listen(PORT, () => console.log('api-gateway on', PORT));
