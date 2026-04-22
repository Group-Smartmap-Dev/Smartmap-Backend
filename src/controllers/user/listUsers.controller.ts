import { Request, Response } from 'express';
import { listUsersService } from '../../services/user/listUsers.service.js';

export const listUsersController = async (req: Request, res: Response) => {
  const { role, limit, offset } = req.query;
  const companyId = req.user?.id;

  if (!companyId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
    });
  }

  const result = await listUsersService({
    companyId,
    role: (role as string) || undefined,
    limit: limit ? parseInt(limit as string) : 50,
    offset: offset ? parseInt(offset as string) : 0,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
};
