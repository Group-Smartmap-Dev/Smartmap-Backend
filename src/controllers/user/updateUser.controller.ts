import { Request, Response } from 'express';
import { updateUserService } from '../../services/user/updateUser.service.js';

export const updateUserController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, phone, role } = req.body;
  const companyId = req.user?.id;

  if (!companyId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
    });
  }

  const user = await updateUserService({
    userId,
    companyId,
    name,
    phone,
    role,
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
};
