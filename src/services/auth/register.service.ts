import { prisma } from '../../config/prisma.js';
import { hashPassword } from '../../utils/password.js';
import { ConflictError, BadRequestError } from '../../utils/errors.js';
import {
  validateEmail,
  validatePassword,
  validateCompanyName,
} from '../../utils/validators.js';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  whatsapp?: string;
}

export const registerService = async (input: RegisterInput) => {
  // Validation
  const nameError = validateCompanyName(input.name);
  if (nameError) throw new BadRequestError(nameError);

  if (!validateEmail(input.email)) {
    throw new BadRequestError('Invalid email format');
  }

  const passwordError = validatePassword(input.password);
  if (passwordError) throw new BadRequestError(passwordError);

  // Check if company already exists
  const existingCompany = await prisma.company.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingCompany) {
    throw new ConflictError('Company with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(input.password);

  // Create company
  const company = await prisma.company.create({
    data: {
      name: input.name.trim(),
      email: input.email.toLowerCase(),
      password: hashedPassword,
      phone: input.phone?.trim() || null,
      whatsapp: input.whatsapp?.trim() || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      whatsapp: true,
      createdAt: true,
    },
  });

  return company;
};
