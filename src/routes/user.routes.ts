import { Router } from 'express';
import { createUserController } from '../controllers/user/createUser.controller.js';
import { getUserController } from '../controllers/user/getUser.controller.js';
import { listUsersController } from '../controllers/user/listUsers.controller.js';
import { updateUserController } from '../controllers/user/updateUser.controller.js';
import { deleteUserController } from '../controllers/user/deleteUser.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user in company
 *     description: Add a new team member to your company. Users can be agents or managers.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@company.com"
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "+1234567890"
 *               role:
 *                 type: string
 *                 enum: ["agent", "manager", "admin"]
 *                 default: "agent"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Missing or invalid authentication token
 *   get:
 *     summary: List all users in company
 *     description: Get all team members in your company with optional filtering and pagination.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: role
 *         in: query
 *         schema:
 *           type: string
 *           enum: ["agent", "manager", "admin"]
 *         description: Filter by user role
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *       - name: offset
 *         in: query
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Missing or invalid authentication token
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user details
 *     description: Retrieve details of a specific user in your company.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid authentication token
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update user details
 *     description: Update user information like name, phone, or role.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: "John Updated"
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "+1234567890"
 *               role:
 *                 type: string
 *                 enum: ["agent", "manager", "admin"]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid authentication token
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user
 *     description: Remove a user from your company.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Missing or invalid authentication token
 *       404:
 *         description: User not found
 */

const router = Router();

router.post('/', authMiddleware, createUserController);
router.get('/', authMiddleware, listUsersController);
router.get('/:userId', authMiddleware, getUserController);
router.patch('/:userId', authMiddleware, updateUserController);
router.delete('/:userId', authMiddleware, deleteUserController);

export default router;
