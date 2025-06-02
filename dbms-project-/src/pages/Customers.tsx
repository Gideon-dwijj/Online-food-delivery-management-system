import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import { Customer } from '../types';
import api from '../services/api';
import Toast from '../components/Toast';

const CustomerCard = ({ customer, onDelete }: { customer: Customer, onDelete: (id: string) => void }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold">{customer.name}</h3>
        <p className="text-sm text-gray-500">#{customer.id}</p>
      </div>
      <button onClick={() => onDelete(customer.id)} className="text-red-500 hover:text-red-700">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Mail className="w-4 h-4" />
        <span>{customer.email}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Phone className="w-4 h-4" />
        <span>{customer.phone}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <MapPin className="w-4 h-4" />
        <span>{customer.address}</span>
      </div>
    </div>
  </div>
);

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/customers', form);
      setForm({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
      setToast({ message: 'Customer added!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to create customer', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
      setToast({ message: 'Customer deleted!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete customer', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search customers..."
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>
      <form onSubmit={handleCreate} className="bg-white rounded-xl p-6 shadow-sm mb-4 flex flex-col md:flex-row gap-4">
        <input name="name" value={form.name} onChange={handleInputChange} required placeholder="Name" className="border rounded px-3 py-2" />
        <input name="email" value={form.email} onChange={handleInputChange} required placeholder="Email" className="border rounded px-3 py-2" />
        <input name="phone" value={form.phone} onChange={handleInputChange} required placeholder="Phone" className="border rounded px-3 py-2" />
        <input name="address" value={form.address} onChange={handleInputChange} required placeholder="Address" className="border rounded px-3 py-2" />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={creating}>{creating ? 'Adding...' : 'Add Customer'}</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredCustomers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} onDelete={handleDelete} />
          ))
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Customers;