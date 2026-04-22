import { prisma } from '../../config/prisma.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

export interface CreateUserInput {
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export const createUserService = async (input: CreateUserInput) => {
  if (!input.name || input.name.trim().length < 2) {
    throw new BadRequestError('User name must be at least 2 characters');
  }

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new BadRequestError('Invalid email format');
  }

  const company = await prisma.company.findUnique({
    where: { id: input.companyId },
  });

  if (!company) {
    throw new BadRequestError('Company not found');
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email_companyId: {
        email: input.email.toLowerCase(),
        companyId: input.companyId,
      },
    },
  });

  if (existingUser) {
    throw new BadRequestError('User with this email already exists in this company');
  }

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: input.email.toLowerCase(),
      phone: input.phone?.trim() || null,
      role: input.role || 'agent',
      companyId: input.companyId,
    },
  });

  return user;
};
