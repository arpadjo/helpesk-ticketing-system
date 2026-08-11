import { Pool } from 'pg';
import 'dotenv/config';

import { app } from './app';

const port = Number(process.env.PORT ?? 3000);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({ connectionString: databaseUrl });

const start = async (): Promise<void> => {
  await pool.query('SELECT 1');

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
};

start().catch((error: unknown) => {
  console.error('Unable to start the backend', error);
  process.exit(1);
});
