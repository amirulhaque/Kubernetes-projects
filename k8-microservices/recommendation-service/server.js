const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

const rec = { p101: ['p102','p103'], p102: ['p101'], p103: ['p101'] };

app.get('/', (r,s)=>s.send('🤖 Recommendation Service'));
app.get('/health', (r,s)=>s.json({ok:true}));
app.get('/recommend/:productId', (req,res) => res.json({ recommendations: rec[req.params.productId] || [] }));

app.listen(PORT, ()=>console.log('recommendation-service on',PORT));
