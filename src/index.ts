import 'express-async-errors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env, validateEnv } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { corsMiddleware } from './middlewares/cors.js';
import { errorHandler } from './middlewares/errorHandler.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js';

const app = express();

// Validate environment variables
validateEnv();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging (simple)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, { swaggerOptions: { persistAuthorization: true } }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// 404 handler
app.use('*', (req, _res) => {
  _res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
    },
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    app.listen(env.port, () => {
      console.log(
        `🚀 Server running on http://localhost:${env.port} in ${env.nodeEnv} mode`
      );
      console.log(
        `📊 Health check: http://localhost:${env.port}/api/health`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;
