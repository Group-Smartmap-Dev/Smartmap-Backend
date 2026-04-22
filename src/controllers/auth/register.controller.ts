import { Request, Response } from 'express';
import { registerService } from '../../services/auth/register.service.js';

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password, phone, whatsapp } = req.body;

  const company = await registerService({
    name,
    email,
    password,
    phone,
    whatsapp,
  });

  res.status(201).json({
    success: true,
    message: 'Company registered successfully',
    data: company,
  });
};
