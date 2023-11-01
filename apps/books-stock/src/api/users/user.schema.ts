import { coerce, object } from "zod";

export const userIdSchema = object({
  userId: coerce.number()
});
