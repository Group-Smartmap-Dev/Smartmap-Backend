import { prisma } from '../../config/prisma.js';
import { comparePassword } from '../../utils/password.js';
import { generateToken } from '../../utils/jwt.js';
import { UnauthorizedError } from '../../utils/errors.js';

export interface LoginInput {
  email: string;
  password: string;
}

export const loginService = async (input: LoginInput) => {
  // Find company
  const company = await prisma.company.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!company) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await comparePassword(input.password, company.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate token
  const token = generateToken({
    id: company.id,
    email: company.email,
  });

  return {
    token,
    company: {
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      whatsapp: company.whatsapp,
    },
  };
};
