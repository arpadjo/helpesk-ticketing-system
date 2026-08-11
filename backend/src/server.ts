import { createApp } from './app.js';
import { config } from './config.js';
import { prisma } from './lib/prisma.js';

const start = async (): Promise<void> => {
  await prisma.$connect();
  const app = createApp(prisma);

  app.listen(config.PORT, () => {
    console.log(`Backend listening on http://localhost:${config.PORT}`);
  });
};

start().catch((error: unknown) => {
  console.error('Unable to start the backend', error);
  process.exit(1);
});

const shutdown = async (): Promise<void> => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
