import React, { useEffect, useState } from 'react';
import { Clock, MapPin, Package, User } from 'lucide-react';
import { Order } from '../types';
import api from '../services/api';
import { io } from 'socket.io-client';

const statusColors = {
  'Ordered': 'bg-blue-100 text-blue-800',
  'Cooking': 'bg-yellow-100 text-yellow-800',
  'Packed': 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-orange-100 text-orange-800',
  'Delivered': 'bg-green-100 text-green-800',
};

const OrderCard = ({ order }: { order: Order }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
        {order.status || 'N/A'}
      </span>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Package className="w-4 h-4" />
        <span>{order.name || 'N/A'}</span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600">
        <MapPin className="w-4 h-4" />
        <span>{order.address || 'N/A'}</span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="w-4 h-4" />
        <span>{order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'N/A'}</span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600">
        <User className="w-4 h-4" />
        <span>Customer #{order.customerId || 'N/A'}</span>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Total Amount</span>
        <span className="text-lg font-semibold">₹{Number(order.total).toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const LiveOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Orders');

  const allowedStatuses = [
    'Ordered',
    'Cooking',
    'Packed',
    'Out for Delivery',
    'Delivered',
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/live');
        setOrders(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // Socket.IO for real-time updates
    const socket = io(window.location.origin);
    socket.on('newOrder', (order: Order) => {
      setOrders(prev => [order, ...prev]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredOrders = statusFilter === 'All Orders'
    ? orders.filter(order => allowedStatuses.includes(order.status))
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Live Orders</h1>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option>All Orders</option>
            <option>Ordered</option>
            <option>Cooking</option>
            <option>Packed</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p>No live orders.</p>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}

export default LiveOrders;