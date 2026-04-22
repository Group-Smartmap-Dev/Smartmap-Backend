import { Router } from 'express';
import { createPropertyController } from '../controllers/property/createProperty.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     description: Register a new property with geolocation data. Requires authentication. Properties are map-ready with latitude, longitude, and status.
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - latitude
 *               - longitude
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 example: "Luxury Downtown Penthouse"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "5-bedroom penthouse with panoramic city views"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 minimum: -90
 *                 maximum: 90
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 format: float
 *                 minimum: -180
 *                 maximum: 180
 *                 example: -74.006
 *               contactPhone:
 *                 type: string
 *                 nullable: true
 *                 example: "+1234567890"
 *               contactWhatsApp:
 *                 type: string
 *                 nullable: true
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         description: Validation error (invalid coordinates, missing title, etc.)
 *       401:
 *         description: Missing or invalid authentication token
 */
const router = Router();

router.post('/', authMiddleware, createPropertyController);

export default router;
