import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Megaphone,
  FileText,
  CalendarDays,
  CalendarRange,
  Users,
  Settings,
  LayoutDashboard,
  Shield,
  GraduationCap,
  MailCheck,
  Menu,
  X,
  UserCheck,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  settings: SchoolSettings;
  onOpenEmailLogs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  settings,
  onOpenEmailLogs,
}) => {
  const { profile, isPrincipal, setIsSwitchModalOpen, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'announcements', label: '1. Announcements', icon: Megaphone },
    { id: 'circulars', label: '2. Circulars', icon: FileText },
    { id: 'events', label: '3. Events', icon: CalendarDays },
    { id: 'timetable', label: '4. Timetable', icon: CalendarRange },
    ...(isPrincipal
      ? [
          { id: 'teachers', label: '5. Faculty Directory', icon: Users },
          { id: 'settings', label: '6. Settings', icon: Settings },
        ]
      : []),
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Crest */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-900 transition-colors tracking-tight">
                  {settings.institutionName || settings.schoolName || "St. Xavier's Academy"}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Official School Smart Hub
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Email Logs Button */}
            {isPrincipal && (
              <button
                onClick={onOpenEmailLogs}
                title="View live SMTP dispatch audit records"
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <MailCheck className="w-4 h-4 text-emerald-700" />
                <span className="hidden xl:inline">Audit Logs</span>
              </button>
            )}

            {/* Role Badge and Switcher */}
            <div
              onClick={() => setIsSwitchModalOpen(true)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
              title="Click to switch role (Principal / Faculty)"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                isPrincipal ? 'bg-blue-950 text-amber-400' : 'bg-indigo-700 text-white'
              }`}>
                {isPrincipal ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-bold text-slate-900 leading-tight">
                  {isPrincipal ? 'Principal' : profile?.name?.split(' ')[0] || 'Teacher'}
                </span>
                <span className="block text-[9px] font-semibold text-blue-800 uppercase tracking-wider">
                  Switch Role
                </span>
              </div>
            </div>
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsSwitchModalOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-blue-900"
              title="Switch Role"
            >
              {isPrincipal ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 animate-in slide-in-from-top-2">
          <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Logged in as:</span>
              <span className="text-xs font-bold text-blue-900">
                {isPrincipal ? 'Principal (Admin)' : profile?.name || 'Faculty Member'}
              </span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSwitchModalOpen(true);
              }}
              className="text-[11px] text-blue-900 font-bold underline"
            >
              Switch Role
            </button>
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {isPrincipal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEmailLogs();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <MailCheck className="w-4 h-4 text-emerald-700" />
              <span>Email Audit Records</span>
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>7. Logout / Exit Session</span>
          </button>
        </div>
      )}
    </header>
  );
};
