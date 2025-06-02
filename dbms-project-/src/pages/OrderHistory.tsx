import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Package, MapPin, Clock, User } from 'lucide-react';
import { Order } from '../types';
import api from '../services/api';

const OrderHistoryCard = ({ order }: { order: Order }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800`}>
        Delivered
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
        <span>
          {order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy h:mm a') : 'N/A'}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600">
        <User className="w-4 h-4" />
        <span>Customer #{order.customerId || 'N/A'}</span>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Total Amount</span>
        <span className="text-lg font-semibold">
          ₹{Number(order.total ?? order.amount ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  </div>
);

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/history');
      setOrders(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const filteredOrders = date
    ? orders.filter(order => format(new Date(order.createdAt), 'yyyy-MM-dd') === date)
    : orders;

  // Calculate total revenue in INR
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total ?? order.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Total Revenue Big Block at the Top */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="w-full flex justify-center">
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl px-10 py-8 flex flex-col items-center shadow-lg mb-6 w-full max-w-3xl">
            <span className="text-2xl font-bold text-white mb-2">Total Revenue</span>
            <span className="text-4xl font-extrabold text-white tracking-wide">
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
        <div className="flex gap-2">
          <input
            type="date"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            value={date}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p>No order history found.</p>
        ) : (
          filteredOrders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;