// app.ts
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { errorHandler } from './Middlewares/errorHandlingMiddleware';
import { affixRouter } from './Routes/Affix/affix.route';
import { statRouter } from './Routes/Affix/stat.route';
import { authRouter } from './Routes/auth/auth.route';
import { itemRouter } from './Routes/Item/item.route';

const app = express();

// middleware parse body
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173', // chỉ định rõ, không dùng *
    credentials: true,
  })
);

// routes
app.use('/api/auth', authRouter);
app.use('/api', affixRouter);
app.use('/api', statRouter);
app.use('/api', itemRouter);
// ⚠️ error handler luôn để CUỐI
app.use(errorHandler);

export default app;
