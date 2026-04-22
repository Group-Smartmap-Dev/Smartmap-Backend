import { Request, Response } from 'express';
import { createUserService } from '../../services/user/createUser.service.js';

export const createUserController = async (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;
  const companyId = req.user?.id;

  if (!companyId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
    });
  }

  const user = await createUserService({
    companyId,
    name,
    email,
    phone,
    role,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
};
