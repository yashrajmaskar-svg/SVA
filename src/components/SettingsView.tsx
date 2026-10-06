import React, { useState, useEffect } from 'react';
import { SchoolSettings } from '../types';
import { getSettings, updateSettings, resetToSampleData } from '../services/schoolService';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Building,
  Shield,
  Mail,
  Phone,
  Server,
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface SettingsViewProps {
  onSettingsUpdated: (updated: SchoolSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSettingsUpdated }) => {
  const { isPrincipal } = useAuth();
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [institutionName, setInstitutionName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [boardName, setBoardName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalEmail, setPrincipalEmail] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [smtpConfigured, setSmtpConfigured] = useState(true);
  const [senderEmail, setSenderEmail] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
      setInstitutionName(data.institutionName || data.schoolName || '');
      setSchoolCode(data.schoolCode || '');
      setAffiliationNumber(data.affiliationNumber || '');
      setBoardName(data.boardName || '');
      setSchoolAddress(data.schoolAddress || '');
      setPrincipalName(data.principalName || '');
      setPrincipalEmail(data.principalEmail || '');
      setContactEmail(data.contactEmail || '');
      setContactPhone(data.contactPhone || '');
      setAcademicYear(data.academicYear || '');
      setSmtpConfigured(data.smtpConfigured !== false);
      setSenderEmail(data.senderEmail || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPrincipal) return;

    setIsSaving(true);
    try {
      const updated: SchoolSettings = {
        institutionName,
        schoolName: institutionName,
        schoolCode,
        affiliationNumber,
        boardName,
        schoolAddress,
        principalName,
        principalEmail,
        contactEmail,
        contactPhone,
        academicYear,
        smtpConfigured,
        senderEmail,
      };

      await updateSettings(updated);
      setSettings(updated);
      onSettingsUpdated(updated);
      showToast('Institutional settings saved successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to reset all data to default institutional sample records? This will restore original announcements, circulars, events, and teachers.')) {
      await resetToSampleData();
      await loadData();
      showToast('Data reset to default demonstration records.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              6. School Institutional Settings
            </h1>
            <p className="text-xs text-slate-500">
              {isPrincipal
                ? 'Configure institutional branding, principal authority, affiliation IDs, and SMTP relay servers'
                : 'View official institutional parameters and school governance details'}
            </p>
          </div>
        </div>

        {isPrincipal && (
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Institution Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-slate-900 text-sm">Institution Identity & Affiliation</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institution Legal Name *</label>
              <input
                type="text"
                disabled={!isPrincipal}
                required
                value={institutionName}
                onChange={e => setInstitutionName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">School Code / Identification</label>
              <input
                type="text"
                disabled={!isPrincipal}
                value={schoolCode}
                onChange={e => setSchoolCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Affiliation / Registration Number</label>
              <input
                type="text"
                disabled={!isPrincipal}
                value={affiliationNumber}
                onChange={e => setAffiliationNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Board Affiliation</label>
              <input
                type="text"
                disabled={!isPrincipal}
                value={boardName}
                onChange={e => setBoardName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Campus Physical Address</label>
              <input
                type="text"
                disabled={!isPrincipal}
                value={schoolAddress}
                onChange={e => setSchoolAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Academic Session</label>
              <input
                type="text"
                disabled={!isPrincipal}
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                placeholder="2026-2027"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Principal & Contact Governance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Principal Authority & Official Channels</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Principal / Head of Institution Name *</label>
              <input
                type="text"
                disabled={!isPrincipal}
                required
                value={principalName}
                onChange={e => setPrincipalName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Principal Official Email</label>
              <input
                type="email"
                disabled={!isPrincipal}
                value={principalEmail}
                onChange={e => setPrincipalEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campus Reception Helpline / Phone</label>
              <input
                type="text"
                disabled={!isPrincipal}
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">School General Admissions Email</label>
              <input
                type="email"
                disabled={!isPrincipal}
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Server & SMTP Relay Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">SMTP Dispatch & Notification Gateway</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Relay Online (TLS Port 587)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">System Outgoing Sender Address</label>
              <input
                type="email"
                disabled={!isPrincipal}
                value={senderEmail}
                onChange={e => setSenderEmail(e.target.value)}
                placeholder="notifications@schoolsmarthub.edu"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 disabled:bg-slate-50 font-mono"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!isPrincipal}
                  checked={smtpConfigured}
                  onChange={e => setSmtpConfigured(e.target.checked)}
                  className="rounded text-blue-900 focus:ring-blue-900 w-4 h-4 disabled:opacity-50"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Automatic Email Notifications Enabled
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Trigger background mail dispatch whenever urgent announcements are published.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        {isPrincipal && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Configurations...' : 'Save Institutional Settings'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
