import './env.js';
import express from 'express';
import './databases/cron-db.js';
import morgan from 'morgan';
import cors from 'cors';
import ErrorHandler from './middlewares/error-handling.js';
import Routers from './routes.js';
import './container.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';


const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.URL_FE,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'RPAM PUDAM API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: { persistAuthorization: true },
  }));
}

app.use('/api', Routers);
app.use(ErrorHandler);


if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`server run at http://${process.env.HOST}:${process.env.PORT}`);
  });
}


export default app;