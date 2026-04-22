import { Request, Response } from 'express';
import { createPropertyService } from '../../services/property/createProperty.service.js';

export const createPropertyController = async (req: Request, res: Response) => {
  const { title, description, latitude, longitude, contactPhone, contactWhatsApp } = req.body;
  const companyId = req.user?.id;

  if (!companyId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
    });
  }

  const property = await createPropertyService({
    companyId,
    title,
    description,
    latitude,
    longitude,
    contactPhone,
    contactWhatsApp,
  });

  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: property,
  });
};
