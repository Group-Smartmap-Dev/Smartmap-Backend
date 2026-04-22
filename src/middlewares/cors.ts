import cors from 'cors';
import { env } from '../config/env.js';

const origins = env.corsOrigin.split(',').map((origin) => origin.trim());

export const corsMiddleware = cors({
  origin: origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
});
