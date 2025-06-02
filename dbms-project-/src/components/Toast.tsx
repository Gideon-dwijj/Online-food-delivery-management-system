import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const bgColors = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded shadow-lg flex items-center gap-4 ${bgColors[type]}`}
    role="alert">
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-lg font-bold">&times;</button>
  </div>
);

export default Toast; 