export interface Order {
  id: string;
  name: string;
  address: string;
  status: 'Ordered' | 'Cooking' | 'Packed' | 'Out for Delivery' | 'Delivered';
  customerId: string;
  total: number;
  items: OrderItem[];
  createdAt: Date;
  deliveredAt?: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: string[];
}

export interface DeliveryAgent {
  id: string;
  name: string;
  photo: string;
  status: 'Delivering' | 'Free';
  currentLocation?: {
    lat: number;
    lng: number;
  };
  currentOrderId?: string;
}

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  rating: number;
  feedback: string;
  createdAt: Date;
}