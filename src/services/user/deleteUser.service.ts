import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

export const deleteUserService = async (userId: string, companyId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: 'User deleted successfully' };
};
