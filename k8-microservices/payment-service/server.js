const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.get('/', (r,s)=>s.send('💳 Payment Service'));
app.get('/health', (r,s)=>s.json({ok:true}));

app.post('/pay', (req,res) => {
  const { userId, amount } = req.body || {};
  if(!userId || typeof amount !== 'number') return res.status(400).json({error:'bad request'});
  // Fake succeed
  res.json({ status: 'success', txId: 'tx-'+Date.now() });
});

app.listen(PORT, ()=>console.log('payment-service on',PORT));
