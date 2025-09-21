const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const client = require('prom-client'); // ✅ Add Prometheus client
const app = express();
const PORT = 3000;

// Enable CORS for your frontend
app.use(cors({
  origin: "http://52.23.161.111:30081", // frontend NodePort
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Explicitly handle preflight requests
app.options('*', cors());

// Prometheus metrics setup
const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route']
});

// Middleware to count requests
app.use((req, res, next) => {
  requestCounter.labels(req.method, req.path).inc();
  next();
});

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypass',
  database: process.env.DB_NAME || 'mydb'
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database');
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Backend API!');
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('DB query failed');
    }
    res.json(results);
  });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
