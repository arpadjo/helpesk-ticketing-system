import cors from 'cors';
import express from 'express';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/hello', (_request, response) => {
  response.json({ message: 'Hello from the Helpdesk API!' });
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

