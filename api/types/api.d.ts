export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Order {
  id: number;
  orderName: string;
  customerId: number;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
  orderTime: string;
}

export interface Review {
  id: number;
  user: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  // add more fields as needed
}

export interface DeliveryAgent {
  id: number;
  name: string;
  // add more fields as needed
} 