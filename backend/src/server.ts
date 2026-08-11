import { Pool } from 'pg';

import { app } from './app';
import { config } from './config';

const pool = new Pool({ connectionString: config.DATABASE_URL });

const start = async (): Promise<void> => {
  await pool.query('SELECT 1');

  app.listen(config.PORT, () => {
    console.log(`Backend listening on http://localhost:${config.PORT}`);
  });
};

start().catch((error: unknown) => {
  console.error('Unable to start the backend', error);
  process.exit(1);
});
