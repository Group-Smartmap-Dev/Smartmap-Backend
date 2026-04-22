import { Router } from 'express';
import { registerController } from '../controllers/auth/register.controller.js';
import { loginController } from '../controllers/auth/login.controller.js';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new company
 *     description: Create a new company account with email and password. Password must be strong (8+ chars, uppercase, lowercase, number).
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acme Real Estate"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contact@acme.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "SecurePass123"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               whatsapp:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: Company registered successfully
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
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Company with this email already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Company login
 *     description: Authenticate company with email and password. Returns JWT token for protected endpoints.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contact@acme.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123"
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *       401:
 *         description: Invalid email or password
 */
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);

export default router;
