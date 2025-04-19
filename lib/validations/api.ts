export const apiSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  type: z.enum(['SIMPLE', 'RELATIONAL', 'GRAPHQL']),
  structure: z.any(),
  isPublic: z.boolean().optional(),
}); 