import { object, string, coerce, TypeOf } from "zod";

export const bookIdSchema = object({
  bookId: coerce.number()
});

const createBookCommonSchema = object({
  name: string({
    required_error: "Book name is required."
  })
});

export const createBookWithAuthorIdSchema = createBookCommonSchema.extend({
  authorId: coerce.number({
    required_error: "Author Id is required."
  })
});

export const createBookWithAuthorInfoSchema = createBookCommonSchema.extend({
  authorFirstName: string({
    required_error: "Author first name is required."
  }),
  authorLastName: string({
    required_error: "Author last name is required."
  })
});

export const updateBookSchema = object({
  bookId: coerce.number(),
  name: string(),
  authorId: coerce.number()
});

export const patchBookSchema = object({
  bookId: coerce.number(),
  name: string().optional(),
  authorId: coerce.number().optional()
});

export type BookIdInput = TypeOf<typeof bookIdSchema>;

export type CreateBookWithAuthorIdInput = TypeOf<
  typeof createBookWithAuthorIdSchema
>;

export type CreateBookWithAuthorInfoInput = TypeOf<
  typeof createBookWithAuthorInfoSchema
>;

export type UpdateBookInput = TypeOf<typeof updateBookSchema>;

export type PatchBookInput = TypeOf<typeof patchBookSchema>;
