const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;
const SERVICE_NAME = process.env.SERVICE_NAME || 'worker';

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

app.get('/cpu', (req, res) => {
  const start = Date.now();
  const loadMs = parseInt(req.query.load) || 1000;

  log(`GET /cpu called - load=${loadMs}ms`);

  // Gera carga real de CPU (bloqueia o event loop de propósito)
  const end = start + loadMs;
  while (Date.now() < end) {
    // loop vazio intencional – consome CPU de forma simples e previsível
    // Math.sqrt(Math.random()) só para evitar otimização agressiva do V8 em alguns casos
    for (let i = 0; i < 50000; i++) {
      Math.sqrt(i * Math.random());
    }
  }

  const duration = Date.now() - start;
  log(`/cpu completed - requested=${loadMs}ms, actual=${duration}ms`);

  res.json({
    status: 'done',
    requested_load_ms: loadMs,
    actual_time_ms: duration,
    service: SERVICE_NAME,
  });
});

process.on('SIGTERM', () => {
  log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  log(`listening on port ${PORT}`);
});