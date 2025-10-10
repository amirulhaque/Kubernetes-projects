const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;
let reviews = {};

app.get('/', (r,s)=>s.send('✍️ Review Service'));
app.get('/health', (r,s)=>s.json({ok:true}));
app.post('/products/:id/review', (req,res) => {
  const id = req.params.id, { user, text } = req.body || {};
  reviews[id] = reviews[id] || [];
  reviews[id].push({ user, text, created: Date.now() });
  res.json({ ok:true });
});
app.get('/products/:id/reviews', (req,res) => res.json(reviews[req.params.id] || []));

app.listen(PORT, ()=>console.log('review-service on',PORT));
