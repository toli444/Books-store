import { object, string, coerce, TypeOf } from "zod";

export const getOneBookSchema = object({
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

export type GetOneBookInput = TypeOf<typeof getOneBookSchema>;

export type CreateBookWithAuthorIdInput = TypeOf<
  typeof createBookWithAuthorIdSchema
>;

export type CreateBookWithAuthorInfoInput = TypeOf<
  typeof createBookWithAuthorInfoSchema
>;
