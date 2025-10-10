const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.get('/', (r,s)=>s.send('🚚 Shipping Service'));
app.get('/health', (r,s)=>s.json({ok:true}));

app.post('/create', (req,res) => {
  const { userId, items } = req.body || {};
  if(!userId) return res.status(400).json({error:'missing user'});
  res.json({ shipmentId: 'sh-'+Date.now(), etaDays: 3 });
});

app.post('/track/:shipmentId', (req,res) => {
  res.json({ shipmentId: req.params.shipmentId, status: 'in-transit' });
});

app.listen(PORT, ()=>console.log('shipping-service on',PORT));
