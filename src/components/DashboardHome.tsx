import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SchoolSettings, Announcement, Circular, SchoolEvent, TimetableEntry, Teacher, EmailLog } from '../types';
import {
  getAnnouncements,
  getCirculars,
  getEvents,
  getTimetable,
  getTeachers,
  getEmailLogs,
} from '../services/schoolService';
import {
  Megaphone,
  FileText,
  CalendarDays,
  CalendarRange,
  Users,
  Settings,
  LogOut,
  Shield,
  GraduationCap,
  Clock,
  ArrowRight,
  Send,
  AlertCircle,
  Building,
  MailCheck,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface DashboardHomeProps {
  settings: SchoolSettings;
  onNavigate: (section: string) => void;
  onOpenEmailLogs: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  settings,
  onNavigate,
  onOpenEmailLogs,
}) => {
  const { profile, isPrincipal, logout } = useAuth();
  const [counts, setCounts] = useState({
    announcements: 0,
    circulars: 0,
    events: 0,
    teachers: 0,
    activeTeachers: 0,
    timetablePeriods: 0,
    emailSuccessRate: 100,
    totalEmailsSent: 0,
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [anns, circs, evts, tts, tchs, logs] = await Promise.all([
          getAnnouncements(isPrincipal),
          getCirculars(),
          getEvents(),
          getTimetable(),
          isPrincipal ? getTeachers() : Promise.resolve([]),
          isPrincipal ? getEmailLogs() : Promise.resolve([]),
        ]);

        const activeTchs = tchs.filter(t => t.active !== false).length;
        const totalLogs = logs.length;
        const sentLogs = logs.filter(l => l.status === 'sent').length;
        const successRate = totalLogs > 0 ? Math.round((sentLogs / totalLogs) * 100) : 100;

        setCounts({
          announcements: anns.length,
          circulars: circs.length,
          events: evts.length,
          timetablePeriods: tts.length,
          teachers: tchs.length,
          activeTeachers: activeTchs,
          emailSuccessRate: successRate,
          totalEmailsSent: sentLogs,
        });

        setRecentAnnouncements(anns.slice(0, 3));
        setUpcomingEvents(evts.slice(0, 3));
      } catch (err) {
        console.error('Failed to load overview counters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [isPrincipal]);

  return (
    <div className="space-y-6">
      {/* Principal or Teacher Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-blue-900">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <span className="text-9xl">🏛️</span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 bg-blue-800/80 text-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-700">
              {isPrincipal ? <Shield className="w-3.5 h-3.5 text-amber-400" /> : <GraduationCap className="w-3.5 h-3.5 text-blue-300" />}
              {isPrincipal ? 'Administrator Portal' : 'Faculty Member Portal'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isPrincipal ? 'Welcome, Principal' : `Welcome, ${profile?.name || 'Faculty Member'}`}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-blue-200 leading-relaxed">
            {isPrincipal
              ? `You are logged into the central administrative console for ${settings.institutionName || settings.schoolName || 'the institution'}. You have full authority to create, edit, delete, and dispatch school communications.`
              : `You are connected to the official communication hub of ${settings.institutionName || settings.schoolName || 'the institution'}. Review latest school notices, official circulars, event agendas, and timetable.`}
          </p>

          <div className="mt-4 pt-4 border-t border-blue-800/60 flex flex-wrap gap-4 text-xs text-blue-300">
            <div>
              Campus: <span className="text-white font-medium">{settings.schoolAddress || 'Main Campus'}</span>
            </div>
            <div>
              Head of Institution: <span className="text-white font-medium">{settings.principalName || 'Principal'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS WIDGET (Active Teachers, Pending Announcements, Recent Email Success Rate) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              School Smart Hub — Operations Summary
            </h3>
          </div>
          {isPrincipal && (
            <button
              onClick={onOpenEmailLogs}
              className="text-xs text-blue-900 hover:text-blue-700 font-semibold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Email Audit Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Total Active Teachers */}
          <div
            onClick={() => isPrincipal && onNavigate('teachers')}
            className={`p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between ${
              isPrincipal ? 'cursor-pointer' : ''
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Active Teachers
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">
                  {counts.activeTeachers || counts.teachers}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Active Faculty
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Recipients for school broadcast notifications
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* 2. Pending Announcements */}
          <div
            onClick={() => onNavigate('announcements')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Published Announcements
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">
                  {counts.announcements}
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Live in Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Active notices & official communications
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>

          {/* 3. Recent Email Success Rates */}
          <div
            onClick={onOpenEmailLogs}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Recent Email Success Rate
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-700">
                  {counts.emailSuccessRate}%
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  SMTP Delivery
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {counts.totalEmailsSent > 0
                  ? `${counts.totalEmailsSent} emails accepted by mail server`
                  : 'Live SMTP delivery monitor'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <MailCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY QUICK ACTION CARDS */}
      {isPrincipal ? (
        /* PRINCIPAL DASHBOARD 7 CARDS */
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            Principal Administration Hub
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Announcements */}
            <div
              onClick={() => onNavigate('announcements')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <Megaphone className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900">{counts.announcements}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mt-4 group-hover:text-blue-900">
                1. Announcements
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Create, edit, delete & publish announcements with automated email notifications.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-900">
                <span>Manage Announcements</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Circulars */}
            <div
              onClick={() => onNavigate('circulars')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-900 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900">{counts.circulars}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mt-4 group-hover:text-amber-900">
                2. Circulars
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Add, edit, delete, and publish official school circulars & policy memos.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-800">
                <span>Manage Circulars</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Events */}
            <div
              onClick={() => onNavigate('events')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-900 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900">{counts.events}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mt-4 group-hover:text-emerald-900">
                3. Events
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Add, edit, and delete academic events, examinations, and council functions.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-800">
                <span>Manage Events</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Timetable */}
            <div
              onClick={() => onNavigate('timetable')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <CalendarRange className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900">{counts.timetablePeriods}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mt-4 group-hover:text-indigo-900">
                4. Timetable
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Add, edit, and delete class periods for Monday through Saturday schedules.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-800">
                <span>Manage Timetable</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 5. Teacher Email Management */}
            <div
              onClick={() => onNavigate('teachers')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-900 group-hover:bg-purple-600 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900">{counts.teachers}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mt-4 group-hover:text-purple-900">
                5. Teacher Email Management
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Add, edit, deactivate, and manage recipient email addresses for faculty dispatches.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-purple-800">
                <span>Manage Faculty List</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 6. School Settings */}
            <div
              onClick={() => onNavigate('settings')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-800 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <Settings className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase text-slate-400">Core</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mt-4 group-hover:text-slate-900">
                6. School Settings
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Configure school profile, principal identity, campus phone, email, and server status.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-slate-700">
                <span>Configure Settings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 7. Logout Card */}
            <div
              onClick={logout}
              className="bg-red-50/50 rounded-xl border border-red-200 p-5 shadow-xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer group sm:col-span-2 lg:col-span-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-950 text-base group-hover:text-red-700">
                      7. Logout
                    </h4>
                    <p className="text-xs text-red-800/80">
                      Securely terminate your principal session and lock administrative credentials.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider group-hover:underline">
                  Exit Session →
                </span>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* TEACHER DASHBOARD VIEW (READ ONLY, CLEAN NAVIGATION) */
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            Faculty Navigation Portal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Announcements (Read Only) */}
            <div
              onClick={() => onNavigate('announcements')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                <Megaphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Read Announcements</h4>
              <p className="text-xs text-slate-500 mt-1">
                {counts.announcements} announcements published by Principal.
              </p>
            </div>

            {/* Circulars (Read Only) */}
            <div
              onClick={() => onNavigate('circulars')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Read Circulars</h4>
              <p className="text-xs text-slate-500 mt-1">
                {counts.circulars} official administrative directives.
              </p>
            </div>

            {/* Events (Read Only) */}
            <div
              onClick={() => onNavigate('events')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">View Events</h4>
              <p className="text-xs text-slate-500 mt-1">
                {counts.events} scheduled academic calendar events.
              </p>
            </div>

            {/* Timetable (Read Only) */}
            <div
              onClick={() => onNavigate('timetable')}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                <CalendarRange className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">View Timetable</h4>
              <p className="text-xs text-slate-500 mt-1">
                Daily period schedule across Monday to Saturday.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* QUICK PREVIEW TILES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest Announcements */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-900" />
              <span>Latest Announcements</span>
            </h4>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-blue-900 font-bold hover:underline"
            >
              View All ({counts.announcements})
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-3">
            {recentAnnouncements.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No announcements published yet.</p>
            ) : (
              recentAnnouncements.map(ann => (
                <div key={ann.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ann.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : ann.priority === 'Important'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 mt-1 truncate">
                    {ann.title}
                  </h5>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                    {ann.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-700" />
              <span>Upcoming School Events</span>
            </h4>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs text-blue-900 font-bold hover:underline"
            >
              View Calendar ({counts.events})
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming events scheduled.</p>
            ) : (
              upcomingEvents.map(evt => (
                <div key={evt.id} className="py-3 flex items-start gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center shrink-0 w-12">
                    <span className="block text-[9px] font-bold uppercase text-blue-800">
                      {new Date(evt.eventDate).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="block text-sm font-extrabold text-blue-950">
                      {new Date(evt.eventDate).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {evt.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{evt.startTime}</span>
                      <span>•</span>
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
