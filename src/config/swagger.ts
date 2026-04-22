import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Estate Map API',
      version: '1.0.0',
      description:
        'Scalable B2B real estate platform backend with map-centric design. Companies can register properties with geolocation data for visualization on maps.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/auth/login endpoint',
        },
      },
      schemas: {
        Company: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cuid123' },
            name: { type: 'string', example: 'Acme Real Estate' },
            email: { type: 'string', format: 'email', example: 'contact@acme.com' },
            phone: { type: 'string', nullable: true, example: '+1234567890' },
            whatsapp: { type: 'string', nullable: true, example: '+1234567890' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cuid789' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@company.com' },
            phone: { type: 'string', nullable: true, example: '+1234567890' },
            role: { type: 'string', enum: ['agent', 'manager', 'admin'], example: 'agent' },
            companyId: { type: 'string', example: 'cuid123' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cuid456' },
            title: { type: 'string', example: 'Luxury Downtown Penthouse' },
            description: { type: 'string', nullable: true },
            latitude: { type: 'number', format: 'float', example: 40.7128 },
            longitude: { type: 'number', format: 'float', example: -74.006 },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'NEGOTIATING', 'SOLD'],
              example: 'AVAILABLE',
            },
            contactPhone: { type: 'string', nullable: true, example: '+1234567890' },
            contactWhatsApp: { type: 'string', nullable: true, example: '+1234567890' },
            companyId: { type: 'string', example: 'cuid123' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                code: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    `${__dirname}/../routes/health.ts`,
    `${__dirname}/../routes/auth.routes.ts`,
    `${__dirname}/../routes/user.routes.ts`,
    `${__dirname}/../routes/property.routes.ts`,
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
