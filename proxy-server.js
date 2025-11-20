/**
 * CityCars Module Federation Proxy Server (Native Node.js - No Dependencies)
 * 
 * Routes:
 * - localhost:3000/admin/* → localhost:4000/admin/* (Admin Portal)
 * - localhost:3000/*      → localhost:3001/* (Main App)
 */

const http = require('http');
const URL = require('url').URL;

const PROXY_PORT = 3000;
const MAIN_APP_PORT = 3001;
const ADMIN_APP_PORT = 4000;

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
    // Copy status code and headers
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    // Pipe response body
    proxyRes.pipe(clientRes, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('❌ Proxy Error:', err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
      clientRes.end('Bad Gateway: Unable to reach the backend service.');
    }
  });

  // Pipe request body
  clientReq.pipe(proxyReq, { end: true });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const url = req.url || '';
  
  // Route /admin/* to admin app on port 4000
  if (url.startsWith('/admin')) {
    console.log(`🟠 [ADMIN] ${req.method} ${url} → localhost:${ADMIN_APP_PORT}`);
    proxyRequest(req, res, ADMIN_APP_PORT);
  } 
  // Route everything else to main app on port 3001
  else {
    console.log(`🟢 [MAIN]  ${req.method} ${url} → localhost:${MAIN_APP_PORT}`);
    proxyRequest(req, res, MAIN_APP_PORT);
  }
});

// WebSocket proxy
server.on('upgrade', (req, socket, head) => {
  const url = req.url || '';
  const targetPort = url.startsWith('/admin') ? ADMIN_APP_PORT : MAIN_APP_PORT;
  const label = url.startsWith('/admin') ? 'ADMIN WS' : 'MAIN WS';
  
  console.log(`🔌 [${label}] ${url} → localhost:${targetPort}`);
  
  const proxyReq = http.request({
    hostname: 'localhost',
    port: targetPort,
    path: url,
    method: req.method,
    headers: req.headers
  });
  
  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
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

// Start proxy server
server.listen(PROXY_PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  🚀 CityCars Module Federation Proxy Server           ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Proxy:        http://localhost:${PROXY_PORT}                      ║`);
  console.log(`║  Main App:     http://localhost:${MAIN_APP_PORT} (internal)           ║`);
  console.log(`║  Admin Portal: http://localhost:${ADMIN_APP_PORT} (internal)           ║`);
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log('║  Access Points:                                        ║');
  console.log(`║  • Main:  http://localhost:${PROXY_PORT}                       ║`);
  console.log(`║  • Admin: http://localhost:${PROXY_PORT}/admin                ║`);
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
});
