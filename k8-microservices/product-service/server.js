const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

const products = [
  { id: 'p101', name: 'Laptop', price: 99900 },
  { id: 'p102', name: 'Phone', price: 59900 },
  { id: 'p103', name: 'Headphones', price: 2500 },
  { id: 'p104', name: 'Smart Watch', price: 9000 },
  { id: 'p105', name: 'Gaming Mouse', price: 1500 },
  { id: 'p106', name: 'Mug', price: 999 },
  { id: 'p106', name: 'Mug', price: 999 },
  { id: 'p106', name: 'Mug', price: 999 },
  { id: 'p106', name: 'Mug', price: 999 },
  { id: 'p106', name: 'Mug', price: 999 }
];

app.get('/', (r,s) => s.send('🛍 Product Service'));
app.get('/health', (r,s) => s.json({ok:true}));
app.get('/products', (r,s) => s.json(products));
app.get('/products/:id', (r,s) => s.json(products.find(p=>p.id===r.params.id) || {}));

app.listen(PORT, ()=>console.log('product-service on',PORT));
