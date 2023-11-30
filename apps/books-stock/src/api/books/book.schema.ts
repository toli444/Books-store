import { number, object, string } from 'zod';

const createBookCommonSchema = object({
  name: string({
    required_error: 'Book name is required.'
  })
});

export const createBookWithAuthorIdSchema = createBookCommonSchema.extend({
  authorId: string({
    required_error: 'Author Id is required.'
  }),
  quantity: number().nonnegative().optional()
});

export const createBookWithAuthorInfoSchema = createBookCommonSchema.extend({
  authorFirstName: string({
    required_error: 'Author first name is required.'
  }),
  authorLastName: string({
    required_error: 'Author last name is required.'
  }),
  quantity: number().nonnegative().optional()
});

export const patchBookSchema = object({
  name: string().optional(),
  authorId: string().optional(),
  quantity: number().optional()
});
