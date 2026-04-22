import { Request, Response } from 'express';
import { getUserService } from '../../services/user/getUser.service.js';

export const getUserController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const companyId = req.user?.id;

  if (!companyId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
    });
  }

  const user = await getUserService(userId, companyId);

  res.status(200).json({
    success: true,
    data: user,
  });
};
