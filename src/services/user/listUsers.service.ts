import { prisma } from '../../config/prisma.js';

export interface ListUsersFilters {
  companyId: string;
  role?: string;
  limit?: number;
  offset?: number;
}

export const listUsersService = async (filters: ListUsersFilters) => {
  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  const where: any = { companyId: filters.companyId };
  if (filters.role) {
    where.role = filters.role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    limit,
    offset,
    pages: Math.ceil(total / limit),
  };
};
