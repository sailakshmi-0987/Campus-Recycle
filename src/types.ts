export interface User {
  id: string;
  email: string;
  fullName: string;
  collegeName: string;
  phone?: string;
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'books' | 'gadgets' | 'clothes' | 'furniture' | 'stationery' | 'other';
  condition: 'new' | 'like-new' | 'good' | 'fair';
  imageUrl: string;
  pickupLocation: string;
  status: 'available' | 'requested' | 'given-away';
  createdAt: Date;
  user?: User;
}

export interface Request {
  id: string;
  itemId: string;
  requesterId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  item?: Item;
  requester?: User;
}
