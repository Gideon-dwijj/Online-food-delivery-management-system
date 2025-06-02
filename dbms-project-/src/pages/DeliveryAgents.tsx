import React, { useEffect, useState } from 'react';
import { MapPin, Package } from 'lucide-react';
import { DeliveryAgent } from '../types';
import api from '../services/api';

const AgentCard = ({ agent }: { agent: DeliveryAgent }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <img
        src={agent.photo || 'https://via.placeholder.com/64'}
        alt={agent.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">{agent.name}</h3>
        <p className="text-sm text-gray-500">#{agent.id}</p>
      </div>
      <span
        className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
          agent.status === 'Delivering'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {agent.status}
      </span>
    </div>
    {agent.status === 'Delivering' && (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Package className="w-4 h-4" />
          <span>Order #{agent.currentOrderId}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>
            Location: {agent.current_order_address ? agent.current_order_address : 'N/A'}
          </span>
        </div>
      </div>
    )}
  </div>
);

const DeliveryAgents = () => {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Agents');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get('/delivery');
        // Map backend fields to frontend type
        const mapped = res.data.map((agent: any) => ({
          id: agent.id,
          name: agent.name,
          photo: agent.profile_img || 'https://via.placeholder.com/64',
          status: agent.status === 'delivering' ? 'Delivering' : 'Free',
          currentOrderId: agent.current_order_id,
          currentLocation: agent.location ? JSON.parse(agent.location) : undefined,
          current_order_address: agent.current_order_address,
        }));
        setAgents(mapped);
        setError('');
      } catch (err) {
        setError('Failed to fetch delivery agents');
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const filteredAgents = statusFilter === 'All Agents'
    ? agents
    : agents.filter(agent => agent.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Agents</h1>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option>All Agents</option>
            <option>Delivering</option>
            <option>Free</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredAgents.length === 0 ? (
          <p>No delivery agents found.</p>
        ) : (
          filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryAgents;