import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import LiveOrders from "./pages/LiveOrders";
import Customers from "./pages/Customers";
import DeliveryAgents from "./pages/DeliveryAgents";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import SignUp from "./pages/SignUp";
import ConnectionTest from "./components/ConnectionTest";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Redirect if not authenticated */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/live-orders" element={<LiveOrders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/delivery-agents" element={<DeliveryAgents />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
              </div>
            }
          />
        ) : (
          <Route path="/*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
