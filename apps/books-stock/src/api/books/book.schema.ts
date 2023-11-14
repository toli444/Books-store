import { object, string, coerce } from 'zod';

export const findBookParamsSchema = object({
  bookId: coerce.number()
});

const createBookCommonSchema = object({
  name: string({
    required_error: 'Book name is required.'
  })
});

export const createBookWithAuthorIdSchema = createBookCommonSchema.extend({
  authorId: coerce.number({
    required_error: 'Author Id is required.'
  })
});

export const createBookWithAuthorInfoSchema = createBookCommonSchema.extend({
  authorFirstName: string({
    required_error: 'Author first name is required.'
  }),
  authorLastName: string({
    required_error: 'Author last name is required.'
  })
});

export const updateBookSchema = createBookWithAuthorIdSchema;

export const patchBookSchema = object({
  name: string().optional(),
  authorId: coerce.number().optional()
});
