import './env.js';
import express from 'express';
// import './databases/cron-db.js';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import Routers from './routes.js';
import ErrorHandler from './middlewares/error-handling.js';
import { swaggerSpec } from './docs/swagger.js';
import logger from './utils/logger.js';

import './container.js';

process.on('uncaughtException', (err) => {
  logger.error(err);
});

process.on('unhandledRejection', (reason) => {
  logger.error(reason);
});

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: process.env.URL_FE,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'RPAM PUDAM API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: { persistAuthorization: true },
    }),
  );
}

app.use('/api', Routers);
app.use(ErrorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}`);
  });
}

export default app;