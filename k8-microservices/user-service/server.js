const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

const users = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com' },
  { id: 'u2', name: 'Bob', email: 'bob@example.com' }
];

app.get('/', (req,res) => res.send('👤 User Service'));
app.get('/health', (req,res) => res.json({ok:true}));
app.get('/users', (req,res) => res.json(users));
app.get('/users/:id', (req,res) => res.json(users.find(u=>u.id===req.params.id) || {}));

app.listen(PORT, ()=>console.log('user-service on',PORT));
