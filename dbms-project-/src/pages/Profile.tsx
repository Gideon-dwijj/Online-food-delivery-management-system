import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Building2, LogOut } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  // Mock user data - replace with real user data from your authentication system
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    branch: 'kukkatpally branch',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop'
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Profile</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-32"></div>
        <div className="px-6 pb-6">
          <div className="relative flex items-end justify-between">
            <div className="-mt-16">
              <img
                src={user.image}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Building2 className="w-5 h-5" />
                <span>{user.branch}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Profile;

