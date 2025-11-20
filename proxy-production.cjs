/**
 * CityCars Production Proxy Server (Module Federation)
 * 
 * For DigitalOcean App Platform:
 * - This proxy runs on $PORT (provided by DO)
 * - Routes /admin/* to admin app (port from ADMIN_PORT env)
 * - Routes /* to main app (port from MAIN_PORT env)
 */

const http = require('http');
const URL = require('url').URL;

const PROXY_PORT = process.env.PORT || 8080;
const MAIN_APP_PORT = process.env.MAIN_PORT || 3001;
const ADMIN_APP_PORT = process.env.ADMIN_PORT || 4000;

console.log('🚀 CityCars Production Proxy Starting...');
console.log(`   Proxy Port: ${PROXY_PORT}`);
console.log(`   Main App Port: ${MAIN_APP_PORT}`);
console.log(`   Admin App Port: ${ADMIN_APP_PORT}`);

// Proxy function
function proxyRequest(clientReq, clientRes, targetPort) {
  const parsedUrl = new URL(clientReq.url, `http://${clientReq.headers.host}`);
  
  const options = {
    hostname: 'localhost',
    port: targetPort,
    path: parsedUrl.pathname + parsedUrl.search,
    method: clientReq.method,
    headers: {
      ...clientReq.headers,
      host: `localhost:${targetPort}`
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('❌ Proxy Error:', err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
      clientRes.end('Bad Gateway');
    }
  });

  clientReq.pipe(proxyReq, { end: true });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const url = req.url || '';
  
  if (url.startsWith('/admin')) {
    proxyRequest(req, res, ADMIN_APP_PORT);
  } else {
    proxyRequest(req, res, MAIN_APP_PORT);
  }
});

// WebSocket support
server.on('upgrade', (req, socket, head) => {
  const url = req.url || '';
  const targetPort = url.startsWith('/admin') ? ADMIN_APP_PORT : MAIN_APP_PORT;
  
  const proxyReq = http.request({
    hostname: 'localhost',
    port: targetPort,
    path: url,
    method: req.method,
    headers: req.headers
  });
  
  proxyReq.on('upgrade', (proxyRes, proxySocket) => {
    socket.write('HTTP/1.1 101 Switching Protocols\r\n');
    Object.keys(proxyRes.headers).forEach(key => {
      socket.write(`${key}: ${proxyRes.headers[key]}\r\n`);
    });
    socket.write('\r\n');
    proxySocket.pipe(socket).pipe(proxySocket);
  });
  
  proxyReq.on('error', (err) => {
    console.error('❌ WebSocket Proxy Error:', err.message);
    socket.end();
  });
  
  proxyReq.end();
});

// Health check endpoint
server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }
});

// Start server
server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log('');
  console.log('✅ CityCars Production Proxy Server is running');
  console.log(`   Public: http://0.0.0.0:${PROXY_PORT}`);
  console.log(`   Main: http://localhost:${MAIN_APP_PORT}`);
  console.log(`   Admin: http://localhost:${ADMIN_APP_PORT}`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

