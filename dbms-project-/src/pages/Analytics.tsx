import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const COLORS = ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE'];
const STATUS_COLORS = ['#4F46E5', '#22c55e', '#f59e42', '#ef4444', '#818CF8', '#A5B4FC', '#C7D2FE'];

const Analytics = () => {
  const [dailyOrders, setDailyOrders] = useState<any[]>([]);
  const [marketingData, setMarketingData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState(7);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dailyOrdersRes, marketingRes, statusRes] = await Promise.all([
          api.get(`/analytics/daily-orders?days=${range}`),
          api.get(`/analytics/weekly-marketing?days=${range}`),
          api.get(`/analytics/status-breakdown?days=${range}`),
        ]);
        setDailyOrders(
          dailyOrdersRes.data.map((item: any) => ({
            day: item.order_date,
            orders: item.total_orders,
          }))
        );
        setMarketingData(
          marketingRes.data.map((item: any) => ({
            name: item.category || item.name,
            value: item.order_count || item.value,
          }))
        );
        setStatusData(
          statusRes.data.map((row: any) => ({
            status: row.status,
            count: Number(row.count)
          }))
        );
        setError('');
      } catch (err) {
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [range]);

  // Sort dailyOrders by date ascending before rendering
  const sortedDailyOrders = [...dailyOrders].sort((a, b) => new Date(a.day) - new Date(b.day));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            value={range}
            onChange={e => setRange(Number(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 3 Months</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Daily Orders</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedDailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  interval={0}
                  tickFormatter={date => {
                    if (!date) return '';
                    const d = new Date(date);
                    return `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short' })}`;
                  }}
                  angle={-40}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Orders by Status Chart in its own row */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
        <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-status-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {statusData.map((item, index) => (
            <div key={item.status} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} />
              <span className="text-sm text-gray-600">{item.status}: {item.count}</span>
            </div>
          ))}
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default Analytics;