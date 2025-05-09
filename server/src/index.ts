
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'express';
import logger from './utils/logger';

const app = express();

// Initialize database
import { sequelize } from './models';
sequelize.sync().then(() => {
  logger.info('Database synced successfully');
}).catch((error) => {
  logger.error('Database sync failed:', error);
});

// Middleware
app.use(cors());
app.use(json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Health check endpoint
import authRouter from './routes/auth';
import documentRouter from './routes/document';
import statusRouter from './routes/status';
import decisionRouter from './routes/decision';
import admissionRouter from './routes/admission';
import studentRouter from './routes/student';

app.use('/api/auth', authRouter);
app.use('/api/documents', documentRouter);
app.use('/api/status', statusRouter);
app.use('/api/decision', decisionRouter);
app.use('/api/admission', admissionRouter);
app.use('/api/student', studentRouter);

// Ensure upload directory exists
import { mkdirSync } from 'fs';
mkdirSync('uploads', { recursive: true });

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
