import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GoBackButton from './components/GoBackButton';
import { Plane } from 'lucide-react';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const BookFlight = React.lazy(() => import('./pages/BookFlight'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

const LoadingFallback = () => (
  <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-slate-500">
      <Plane className="w-12 h-12 animate-pulse text-blue-600" />
      <p className="font-medium animate-pulse">Loading SkyReserve...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <GoBackButton />
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book/:id" element={<BookFlight />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
