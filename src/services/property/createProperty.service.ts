import { prisma } from '../../config/prisma.js';
import { BadRequestError } from '../../utils/errors.js';

export interface CreatePropertyInput {
  companyId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  contactPhone?: string;
  contactWhatsApp?: string;
}

export const createPropertyService = async (input: CreatePropertyInput) => {
  // Validation
  if (!input.title || input.title.trim().length < 3) {
    throw new BadRequestError('Title must be at least 3 characters');
  }

  if (typeof input.latitude !== 'number' || typeof input.longitude !== 'number') {
    throw new BadRequestError('Latitude and longitude must be valid numbers');
  }

  if (input.latitude < -90 || input.latitude > 90) {
    throw new BadRequestError('Latitude must be between -90 and 90');
  }

  if (input.longitude < -180 || input.longitude > 180) {
    throw new BadRequestError('Longitude must be between -180 and 180');
  }

  // Verify company exists
  const company = await prisma.company.findUnique({
    where: { id: input.companyId },
  });

  if (!company) {
    throw new BadRequestError('Company not found');
  }

  // Create property
  const property = await prisma.property.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      latitude: input.latitude,
      longitude: input.longitude,
      contactPhone: input.contactPhone?.trim() || null,
      contactWhatsApp: input.contactWhatsApp?.trim() || null,
      companyId: input.companyId,
      status: 'AVAILABLE',
    },
  });

  return property;
};
