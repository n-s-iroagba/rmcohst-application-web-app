import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'express';


const app = express();

import { requestLogger } from './utils/logger/requestLogger';
import sequelize from './config/database';
import logger from './utils/logger/logger';
sequelize.sync().then(() => {
  logger.info('Database synced successfully');
}).catch((error:any) => {
  logger.error('Database sync failed:', error);
});

// Middleware
app.use(cors());
app.use(json());
app.use(morgan('dev'));
app.use(requestLogger);



const PORT =  5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app