import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Truck, 
  Star,
  TrendingUp,
  Clock,
  IndianRupee
} from 'lucide-react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, label, value, trend, trendIcon: TrendIcon }: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  trendIcon: React.ElementType;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-sm text-green-600 mt-1">{trend}</p>
      </div>
      <div className="bg-indigo-50 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const monthNames = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [ordersRes, customersRes, agentsRes, reviewsRes, trendRes] = await Promise.all([
          api.get('/orders/all'),
          api.get('/customers'),
          api.get('/delivery'),
          api.get('/reviews'),
          api.get('/analytics/monthly-trend'),
        ]);
        setOrders(ordersRes.data);
        setCustomers(customersRes.data);
        setAgents(agentsRes.data);
        setReviews(reviewsRes.data);
        let prev = null;
        const trendWithNames = trendRes.data.map((item: any) => {
          const monthNum = item.month || item.MONTH || 0;
          const orders = item.total_orders || item.orders || 0;
          const percent = prev !== null && prev > 0 ? (((orders - prev) / prev) * 100).toFixed(1) : null;
          prev = orders;
          return {
            month: monthNames[monthNum] || monthNum,
            orders,
            percent
          };
        });
        setMonthlyTrend(trendWithNames);
        setError('');
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Calculate average rating
  const avgRating = reviews.length > 0 ? (
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
  ).toFixed(1) : 'N/A';

  // Calculate total revenue from all orders
  const totalRevenue = orders.reduce((sum, order) => {
    // Use the correct field name for the amount, e.g., order.total or order.amount
    const amount = Number(order.total ?? order.amount ?? 0);
    if (
      order.status &&
      (order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed')
    ) {
      return sum + amount;
    }
    return sum;
  }, 0);

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCreateDummyOrder = async () => {
    setCreating(true);
    try {
      const response = await api.post('/orders/dummy');
      console.log('Dummy order response:', response);
      alert('Dummy order created!');
      // await fetchAll(); // Temporarily commented out to isolate error
    } catch (err) {
      console.error('Dummy order error:', err);
      alert('Failed to create dummy order');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <button
          onClick={handleCreateDummyOrder}
          disabled={creating}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          {creating ? 'Creating...' : 'Generate Order'}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated:</span>
          <span className="text-sm font-medium">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={orders.length.toString()}
          trend={`+${orders.length > 0 ? ((orders.length / 30) * 100).toFixed(1) : 0}% this month`}
          trendIcon={TrendingUp}
        />
        <StatCard
          icon={Users}
          label="Active Customers"
          value={customers.length.toString()}
          trend={`+${customers.length > 0 ? ((customers.length / 10) * 100).toFixed(1) : 0}% growth`}
          trendIcon={TrendingUp}
        />
        <StatCard
          icon={Truck}
          label="Delivery Agents"
          value={agents.length.toString()}
          trend={`${agents.filter(a => a.status === 'free').length} available`}
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={avgRating}
          trend={`Based on ${reviews.length} reviews`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <span className="text-sm text-indigo-600 font-medium">View All</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-500">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-500">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-gray-500">Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{order.id}</td>
                        <td className="py-3 px-4">{order.customerName || 'Guest'}</td>
                        <td className="py-3 px-4">{order.total || order.amount || 0}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(order.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
            </>
          )}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Performance Overview</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Total Revenue:</span>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                <span className="text-sm font-medium text-indigo-600">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => {
                    return value.toLocaleString('en-IN');
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;