export type Book = {
  id: string;
  name: string;
  author: {
    firstName: string;
    lastName: string;
  };
  stockStatus: {
    quantity: number;
  };
};
