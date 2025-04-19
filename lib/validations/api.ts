import { z } from 'zod';
import { ApiType } from '@prisma/client';

export const apiSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  type: z.nativeEnum(ApiType),
  structure: z.record(z.any()),
  isPublic: z.boolean().optional(),
}); 