import { prisma } from '../../config/prisma.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

export interface UpdateUserInput {
  userId: string;
  companyId: string;
  name?: string;
  phone?: string;
  role?: string;
}

export const updateUserService = async (input: UpdateUserInput) => {
  const user = await prisma.user.findFirst({
    where: {
      id: input.userId,
      companyId: input.companyId,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (input.name && input.name.trim().length < 2) {
    throw new BadRequestError('User name must be at least 2 characters');
  }

  const updatedUser = await prisma.user.update({
    where: { id: input.userId },
    data: {
      name: input.name?.trim(),
      phone: input.phone?.trim() || null,
      role: input.role,
    },
  });

  return updatedUser;
};
