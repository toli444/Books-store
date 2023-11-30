import { Types } from 'mongoose';

export function convertStringToObjectId(id: string) {
  try {
    return new Types.ObjectId(id);
  } catch (e) {
    throw new Error(`Invalid id format: ${id}`);
  }
}
