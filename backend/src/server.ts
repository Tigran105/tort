import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      message: 'API server is running',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

app.use('/api', routes);
app.use(errorHandler);

async function startServer(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('MySQL connected successfully');

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
