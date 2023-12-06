export enum orderStatus {
  NEW = 'NEW',
  PROCESSED = 'PROCESSED'
}

export type Order = {
  id: string;
  items: Array<string>;
  status: orderStatus;
};
