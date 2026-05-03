import * as dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import express from 'express';
import helmet from 'helmet';
import { initSocketServer } from './server/socketServer';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Apply security headers
  server.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  // ✅ IMPORTANT: Health check route (for Render)
  server.get('/', (req, res) => {
    res.status(200).send('Server is alive');
  });

  // ✅ Optional but recommended
  server.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  const httpServer = createServer(server);

  // Initialize Socket.io
  initSocketServer(httpServer);

  // Handle Next.js requests (Catch-all)
  server.use((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // ✅ IMPORTANT: bind to 0.0.0.0
  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});