import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from '@config/upload';
import appError from '@shared/errors/AppError';
import "@shared/infra/typeorm";
import '../../container';
import cors from 'cors';
import { errors } from 'celebrate';
import raterLimiter from './middlewares/rateLimiter';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(raterLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof appError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Server Started')
});
