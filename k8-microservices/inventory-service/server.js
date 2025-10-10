const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

const stock = { p101: 10, p102: 5, p103: 20 };

app.get('/', (r,s)=>s.send('📦 Inventory Service'));
app.get('/health', (r,s)=>s.json({ok:true}));

app.get('/stock/:productId', (req,res) => res.json({ productId: req.params.productId, qty: stock[req.params.productId] || 0 }));

app.post('/reserve', (req,res) => {
  const { productId, qty } = req.body || {};
  if(!productId || !qty) return res.status(400).json({error:'bad'});
  stock[productId] = (stock[productId]||0) - qty;
  if(stock[productId] < 0) stock[productId] = 0;
  res.json({ ok:true, remaining: stock[productId] });
});

app.listen(PORT, ()=>console.log('inventory-service on',PORT));
