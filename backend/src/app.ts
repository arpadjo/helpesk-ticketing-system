import cors from 'cors';
import express from 'express';
import type { PrismaClient } from './generated/prisma/client.js';

import { errorHandler } from './middleware/error-handler.js';
import { createTicketRouter } from './routes/tickets.js';

export const createApp = (prisma: PrismaClient) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/v1/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use('/api/v1/tickets', createTicketRouter(prisma));
  app.use(errorHandler);

  return app;
};
