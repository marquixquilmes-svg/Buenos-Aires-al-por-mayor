export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'cancelled';

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};
