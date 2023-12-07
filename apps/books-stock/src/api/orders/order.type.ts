export enum OrderStatuses {
  NEW = 'NEW',
  PROCESSED = 'PROCESSED',
  REJECTED = 'REJECTED'
}

export type Order = {
  id: string;
  items: Array<string>;
  status: OrderStatuses;
};
