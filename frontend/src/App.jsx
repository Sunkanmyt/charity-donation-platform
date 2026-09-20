import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CampaignDetails from './pages/CampaignDetails';
import UserDonations from './pages/UserDonations';
import AdminDashboard from './pages/AdminDashboard';
import CreateCampaign from './pages/CreateCampaign';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />

            {/* Authenticated Donor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['donor', 'admin']} />}>
              <Route path="/my-donations" element={<UserDonations />} />
            </Route>

            {/* Admin-Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/campaigns/new" element={<CreateCampaign />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}