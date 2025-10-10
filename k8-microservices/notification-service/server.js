const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.get('/', (r,s)=>s.send('🔔 Notification Service'));
app.get('/health', (r,s)=>s.json({ok:true}));

app.post('/notify', (req,res) => {
  const { to, message } = req.body || {};
  console.log('Notify', to, message);
  res.json({ status: 'queued' });
});

app.listen(PORT, ()=>console.log('notification-service on',PORT));
