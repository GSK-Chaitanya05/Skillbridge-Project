import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { Volume2, VolumeX, User as UserIcon, Shield, Stethoscope, Sprout } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onOpenAuthModal }) => {
  const { user, role, loginWithDemo, logout } = useAuth();
  const { language, setLanguage, t, isSpeaking, stopSpeaking } = useLanguage();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: t('navDashboard') },
    { id: 'farms', label: t('navFarms') },
    { id: 'soil', label: t('navSoil') },
    { id: 'weather', label: t('navWeatherPests') },
    { id: 'marketplace', label: t('navMarketplace') },
    { id: 'consultation', label: t('navConsultation') },
    ...(role === 'admin' ? [{ id: 'admin', label: t('navAdmin') }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="text-xl font-bold tracking-tight text-emerald-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
              AT
            </div>
            <span>AgriTech</span>
          </button>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-emerald-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Audio speech indicator button for rural accessibility */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                title="Stop Audio"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mute Audio</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['en', 'hi', 'mr', 'es'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`px-2 py-1 rounded font-medium transition-all ${
                    language === lng
                      ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिंदी' : lng === 'mr' ? 'मराठी' : 'ES'}
                </button>
              ))}
            </div>

            {/* User Profile / Quick Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {role === 'farmer' && <Sprout className="w-3.5 h-3.5 text-emerald-700" />}
                {role === 'expert' && <Stethoscope className="w-3.5 h-3.5 text-blue-700" />}
                {role === 'admin' && <Shield className="w-3.5 h-3.5 text-purple-700" />}
                <span className="font-semibold capitalize">{user ? user.name.split(' ')[0] : 'Demo User'}</span>
                <span className="text-slate-400 text-xs">({role})</span>
              </button>

              {showRoleMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs"
                  onMouseLeave={() => setShowRoleMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-slate-500 truncate">{user?.email}</p>
                    <p className="text-emerald-700 font-medium capitalize mt-0.5">Role: {role}</p>
                  </div>

                  <p className="px-3 py-1 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                    Switch Demo Persona
                  </p>
                  <button
                    onClick={() => {
                      loginWithDemo('farmer');
                      setShowRoleMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-left"
                  >
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium text-slate-900">Ramesh Patel (Farmer)</div>
                      <div className="text-slate-500 text-[11px]">12.5 Acres · Wheat & Chickpea</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      loginWithDemo('expert');
                      setShowRoleMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-left"
                  >
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-slate-900">Dr. Sunita Deshmukh (Expert)</div>
                      <div className="text-slate-500 text-[11px]">Agronomist · Soil Chemistry</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      loginWithDemo('admin');
                      setShowRoleMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-left"
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-slate-900">Administrator Console</div>
                      <div className="text-slate-500 text-[11px]">Full CRUD, Alerts & Users</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 mt-2 pt-1 flex justify-between px-2">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenAuthModal();
                      }}
                      className="text-emerald-700 hover:text-emerald-900 py-1 font-medium"
                    >
                      Sign In / Register
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      className="text-rose-600 hover:text-rose-800 py-1 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile subnavigation strip */}
      <div className="md:hidden flex items-center overflow-x-auto gap-2 px-4 py-2 border-t border-slate-100 bg-slate-50 text-xs">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onTabChange(link.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              currentTab === link.id
                ? 'bg-emerald-800 text-white font-medium'
                : 'text-slate-700 bg-white border border-slate-200'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
