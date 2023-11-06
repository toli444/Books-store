import { object, coerce } from 'zod';

export const authorIdSchema = object({
  authorId: coerce.number()
});
