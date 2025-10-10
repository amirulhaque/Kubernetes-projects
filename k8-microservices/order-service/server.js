const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const PORT = 8080;

let orders = [];

app.get('/', (r,s)=>s.send('🧾 Order Service'));
app.get('/health', (r,s)=>s.json({ok:true}));

// create order: body { userId }
app.post('/order', async (req, res) => {
  const { userId } = req.body || {};
  if(!userId) return res.status(400).json({error:'userId required'});
  try {
    // fetch cart from inventory or assume sample items (for demo)
    // For demo, pick first product
    const prod = (await axios.get('http://product-service:8080/products')).data[0];
    const total = prod.price;
    // call payment
    const pay = await axios.post('http://payment-service:8080/pay', { userId, amount: total }).catch(()=>null);
    if(!pay || pay.status !== 200) return res.status(402).json({error:'payment failed'});
    // reserve inventory
    await axios.post('http://inventory-service:8080/reserve', { productId: prod.id, qty: 1 }).catch(()=>null);
    // create shipping
    const ship = await axios.post('http://shipping-service:8080/create', { userId, items: [{id:prod.id, qty:1}] }).catch(()=>null);
    // notify
    await axios.post('http://notification-service:8080/notify', { to: userId, message: 'Order placed' }).catch(()=>null);

    const order = { id: 'o'+Date.now(), userId, items:[{id:prod.id, qty:1}], total, payment: pay?.data || {} , shipping: ship?.data || {} };
    orders.push(order);
    res.json({ ok:true, order });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error:'order-failed' });
  }
});

app.get('/orders', (r,s)=>s.json(orders));
app.listen(PORT, ()=>console.log('order-service on',PORT));
