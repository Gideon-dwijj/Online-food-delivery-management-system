import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Users, 
  Truck, 
  MessageSquare, 
  BarChart, 
  Clock,
  Utensils,
  User
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/live-orders', icon: ShoppingBag, label: 'Live Orders' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/delivery-agents', icon: Truck, label: 'Delivery Agents' },
    { path: '/reviews', icon: MessageSquare, label: 'Reviews' },
    { path: '/analytics', icon: BarChart, label: 'Analytics' },
    { path: '/order-history', icon: Clock, label: 'Order History' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 px-4 py-6 flex flex-col h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Utensils className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold text-gray-800">Kodi Kurra Chitti Gare</span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex-grow">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Profile Button at the Bottom */}
      <div className="mt-auto">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <User className="w-5 h-5" />
          Profile
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
