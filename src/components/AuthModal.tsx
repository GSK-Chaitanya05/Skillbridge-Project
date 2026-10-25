import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Sprout, Stethoscope, Shield, Lock, Mail, User as UserIcon, Phone, MapPin, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, loginWithDemo, error, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer' as UserRole,
    region: 'Indore, Madhya Pradesh',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      onClose();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(regData);
    if (success) {
      onClose();
    }
  };

  const handleDemoSelect = async (role: UserRole) => {
    await loginWithDemo(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-base mx-auto mb-2">
            AT
          </div>
          <h2 className="text-lg font-bold text-slate-900">AgriTech Access Portal</h2>
          <p className="text-xs text-slate-500">Full-Stack Smart Farming Management & Role-Based Security</p>
        </div>

        {/* 1-Click Fast Demo Switcher */}
        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Instant Demo Sign-In (No Password Needed)
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleDemoSelect('farmer')}
              className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-center transition-all flex flex-col items-center gap-1 text-slate-800"
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-[11px]">Farmer</span>
              <span className="text-[10px] text-slate-400">Ramesh P.</span>
            </button>

            <button
              onClick={() => handleDemoSelect('expert')}
              className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-center transition-all flex flex-col items-center gap-1 text-slate-800"
            >
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-[11px]">Agronomist</span>
              <span className="text-[10px] text-slate-400">Dr. Sunita</span>
            </button>

            <button
              onClick={() => handleDemoSelect('admin')}
              className="p-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-center transition-all flex flex-col items-center gap-1 text-slate-800"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-[11px]">Admin</span>
              <span className="text-[10px] text-slate-400">Command</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-4 text-xs">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Credentials
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="farmer@agritech.org"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In via JWT'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={regData.name}
                onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98250 14820"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={regData.role}
                  onChange={(e) => setRegData({ ...regData, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                >
                  <option value="farmer">Farmer</option>
                  <option value="expert">Agronomist / Expert</option>
                  <option value="admin">Platform Admin</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Region / District</label>
                <input
                  type="text"
                  placeholder="Indore, MP"
                  value={regData.region}
                  onChange={(e) => setRegData({ ...regData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Create Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
