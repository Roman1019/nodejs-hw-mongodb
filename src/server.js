import * as fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import { router } from './router/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './router/auth.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate.js';
import swaggerUi from 'swagger-ui-express';

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json'), 'utf-8'),
);

function setupServer() {
  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_DOCUMENT));

  app.use('/photo', express.static(path.resolve('src', 'uploads', 'photos')));

  app.use(cookieParser());
  app.use(cors());

  app.use(pino());

  app.use('/contacts', authenticate, router);
  app.use('/auth', authRouter);

  app.use(errorHandler);

  app.use(notFoundHandler);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, '0.0.0.0', (error) => {
    if (error) {
      console.error('Error starting server:', error);
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;
