const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

function proxyJson(res, r) {
  r.json().then(data => res.json(data)).catch(e => res.status(502).json({error:'bad upstream'}));
}

app.get('/health', (req,res)=>res.json({status:'ok'}));

// example routes
app.get('/api/products', (req,res)=> {
  fetch('http://product-catalog:3000/products').then(r => proxyJson(res,r)).catch(()=>res.status(502).end());
});
app.post('/api/checkout', (req,res)=> {
  fetch('http://checkout-service:4000/checkout', {method:'POST', body: JSON.stringify(req.body), headers:{'Content-Type':'application/json'}})
    .then(r => proxyJson(res,r)).catch(()=>res.status(502).end());
});

app.listen(PORT, ()=>console.log(`api-gateway on ${PORT}`));
