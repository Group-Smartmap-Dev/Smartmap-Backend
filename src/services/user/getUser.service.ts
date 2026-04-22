import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

export const getUserService = async (userId: string, companyId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
