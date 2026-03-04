const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || 'api';

function log(msg) {
  console.log(`[${SERVICE_NAME.toUpperCase()}] ${new Date().toISOString()} - ${msg}`);
}

app.get('/health', (req, res) => {
  log('GET /health called');
  res.status(200).json({ status: 'healthy', service: SERVICE_NAME });
});

app.get('/ready', (req, res) => {
  log('GET /ready called');
  res.status(200).json({ status: 'ready', service: SERVICE_NAME });
});

// Só para ter algo útil (pode chamar o worker depois se quiser)
app.get('/', (req, res) => {
  const start = Date.now();
  log('GET / called');
  res.json({
    message: `Hello from ${SERVICE_NAME}`,
    uptime: process.uptime() | 0,
  });
  log(`GET / completed in ${Date.now() - start}ms`);
});

app.listen(PORT, () => {
  log(`listening on port ${PORT}`);
});