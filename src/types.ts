export interface Item {
  _id: string;
  type: 'lost' | 'found';
  name: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  status: 'unclaimed' | 'claimed';
  posterContact: string;
  createdAt: string;
}

export type NewItem = Omit<Item, '_id' | 'status' | 'createdAt'>;
