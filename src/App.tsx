import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolSettings } from './types';
import { getSettings } from './services/schoolService';
import { Navbar } from './components/Navbar';
import { DashboardHome } from './components/DashboardHome';
import { AnnouncementsView } from './components/AnnouncementsView';
import { CircularsView } from './components/CircularsView';
import { EventsView } from './components/EventsView';
import { TimetableView } from './components/TimetableView';
import { TeachersView } from './components/TeachersView';
import { SettingsView } from './components/SettingsView';
import { EmailLogsModal } from './components/EmailLogsModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { Shield, Sparkles, Building2, Phone, Mail, Award } from 'lucide-react';

function AppContent() {
  const { isPrincipal, profile } = useAuth();
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [isEmailLogsOpen, setIsEmailLogsOpen] = useState(false);
  const [settings, setSettings] = useState<SchoolSettings>({
    institutionName: "St. Xavier's International Academy",
    schoolName: "St. Xavier's International Academy",
    schoolAddress: 'Heritage Campus, Sector 14, Institutional Area, New Delhi - 110001',
    principalName: 'Dr. Rajeshwar Sharma, Ph.D.',
    principalEmail: 'principal@schoolsmarthub.edu',
    contactEmail: 'admissions@schoolsmarthub.edu',
    contactPhone: '+91 11 2684 9000 / +91 98101 23456',
    academicYear: '2026-2027',
    affiliationNumber: 'CBSE/AFF/2130894/2026',
    smtpConfigured: true,
  });

  useEffect(() => {
    getSettings().then(data => {
      if (data) setSettings(data);
    });
  }, []);

  // Safeguard: if a teacher attempts to navigate to teachers or settings, redirect to dashboard
  useEffect(() => {
    if (!isPrincipal && (currentSection === 'teachers' || currentSection === 'settings')) {
      setCurrentSection('dashboard');
    }
  }, [isPrincipal, currentSection]);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        settings={settings}
        onOpenEmailLogs={() => setIsEmailLogsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentSection === 'dashboard' && (
          <DashboardHome
            settings={settings}
            onNavigate={handleNavigate}
            onOpenEmailLogs={() => setIsEmailLogsOpen(true)}
          />
        )}

        {currentSection === 'announcements' && (
          <AnnouncementsView onOpenEmailLogs={() => setIsEmailLogsOpen(true)} />
        )}

        {currentSection === 'circulars' && <CircularsView />}

        {currentSection === 'events' && <EventsView />}

        {currentSection === 'timetable' && <TimetableView />}

        {currentSection === 'teachers' && isPrincipal && (
          <TeachersView onOpenEmailLogs={() => setIsEmailLogsOpen(true)} />
        )}

        {currentSection === 'settings' && (
          <SettingsView
            onSettingsUpdated={updated => setSettings(updated)}
          />
        )}
      </main>

      {/* Global Modals */}
      <EmailLogsModal
        isOpen={isEmailLogsOpen}
        onClose={() => setIsEmailLogsOpen(false)}
      />

      <RoleSwitcherModal />

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-amber-400 flex items-center justify-center font-bold text-sm">
                🏛️
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {settings.institutionName || "St. Xavier's International Academy"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Affiliation No: {settings.affiliationNumber || 'CBSE/AFF/2130894'} • Academic Year: {settings.academicYear || '2026-2027'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-900" />
                {settings.contactPhone || '+91 11 2684 9000'}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-900" />
                {settings.contactEmail || 'admissions@schoolsmarthub.edu'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} School Smart Hub. Secure Institutional Communication & Faculty System.</p>
            <div className="flex items-center gap-3">
              <span>Principal Secretariat</span>
              <span>•</span>
              <span>Faculty Council</span>
              <span>•</span>
              <button
                onClick={() => setIsEmailLogsOpen(true)}
                className="hover:text-blue-900 hover:underline"
              >
                SMTP Audit
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
