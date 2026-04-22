import { Request, Response } from 'express';
import { deleteUserService } from '../../services/user/deleteUser.service.js';

export const deleteUserController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const companyId = req.user?.id;

  if (!companyId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
    });
  }

  await deleteUserService(userId, companyId);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
};
