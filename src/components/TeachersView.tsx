import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import {
  getTeachers,
  saveTeacher,
  deleteTeacher,
  toggleTeacherStatus,
  dispatchNotificationEmail,
} from '../services/schoolService';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Send,
  X,
  CheckCircle,
  Power,
  Shield,
  Clock,
} from 'lucide-react';

interface TeachersViewProps {
  onOpenEmailLogs: () => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({ onOpenEmailLogs }) => {
  const { isPrincipal, loginAs } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Teacher | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Direct email modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState<Teacher | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDepartment, setFormDepartment] = useState('Mathematics');
  const [formDesignation, setFormDesignation] = useState('Faculty Member');
  const [formPhone, setFormPhone] = useState('+91 98201 00000');
  const [formActive, setFormActive] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getTeachers();
      setTeachers(data);
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

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormEmail('');
    setFormDepartment('Mathematics');
    setFormDesignation('Faculty Member');
    setFormPhone('+91 98201 ');
    setFormActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tch: Teacher) => {
    setEditingItem(tch);
    setFormName(tch.name);
    setFormEmail(tch.email);
    setFormDepartment(tch.department);
    setFormDesignation(tch.designation);
    setFormPhone(tch.phone);
    setFormActive(tch.active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const itemToSave: Teacher = {
      id: editingItem ? editingItem.id : `tch-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      department: formDepartment.trim(),
      designation: formDesignation.trim(),
      phone: formPhone.trim(),
      active: formActive,
      joinedDate: editingItem ? editingItem.joinedDate : new Date().toISOString().split('T')[0],
      assignedClasses: editingItem?.assignedClasses || ['Grade 10-A'],
    };

    await saveTeacher(itemToSave);
    setIsModalOpen(false);
    await loadData();
    showToast(editingItem ? 'Faculty profile updated' : 'Faculty member registered!');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this faculty member from the directory?')) {
      await deleteTeacher(id);
      await loadData();
      showToast('Faculty member removed.');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const updated = await toggleTeacherStatus(id);
    if (updated) {
      await loadData();
      showToast(
        updated.active
          ? `${updated.name} activated for school dispatches.`
          : `${updated.name} deactivated (excluded from broadcasts).`
      );
    }
  };

  const handleOpenDirectEmail = (tch: Teacher) => {
    setEmailRecipient(tch);
    setEmailSubject(`Academic Directive & Notice for ${tch.name}`);
    setEmailBody(`Dear ${tch.name},\n\nPlease review your class lesson plans and submit the weekly progress dossier by Friday afternoon.\n\nWarm regards,\nDr. Rajeshwar Sharma, Principal`);
    setIsEmailModalOpen(true);
  };

  const handleSendDirectEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipient) return;

    setIsSending(true);
    try {
      await dispatchNotificationEmail({
        title: emailSubject,
        message: emailBody,
        type: 'direct',
        recipients: [emailRecipient.email],
      });
      setIsEmailModalOpen(false);
      showToast(`Direct email dispatched to ${emailRecipient.email}!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const departments = Array.from(new Set(teachers.map(t => t.department))).sort();

  const filtered = teachers.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? t.active !== false : t.active === false);
    const matchDept = departmentFilter === 'all' || t.department === departmentFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const activeCount = teachers.filter(t => t.active !== false).length;
  const inactiveCount = teachers.filter(t => t.active === false).length;

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
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              5. Teacher Email & Faculty Management
            </h1>
            <p className="text-xs text-slate-500">
              Manage recipient email addresses for broadcasts, activate/deactivate faculty, and monitor deliverability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPrincipal && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          )}
          <button
            onClick={onOpenEmailLogs}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Clock className="w-4 h-4 text-purple-900" />
            <span>Audit Records</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Faculty Roster</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{teachers.length}</span>
            <span className="text-xs text-slate-400">Registered Educators</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active Recipients</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-700">{activeCount}</span>
            <span className="text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
              Receiving Broadcasts
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Inactive / On Leave</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-600">{inactiveCount}</span>
            <span className="text-xs text-slate-500">Excluded from Dispatches</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status buttons */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 font-medium ${
                statusFilter === 'all' ? 'bg-purple-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              All ({teachers.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 font-medium ${
                statusFilter === 'active' ? 'bg-purple-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 font-medium ${
                statusFilter === 'inactive' ? 'bg-purple-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Inactive ({inactiveCount})
            </button>
          </div>

          {/* Department dropdown */}
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-purple-800"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Teachers Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            Loading faculty directory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No faculty members found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting search filters or register a new faculty member.</p>
          </div>
        ) : (
          filtered.map(tch => {
            const isActive = tch.active !== false;

            return (
              <div
                key={tch.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-slate-200 hover:border-purple-300 hover:shadow-md'
                    : 'border-slate-200 bg-slate-50/70 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isActive ? 'bg-purple-100 text-purple-900' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {tch.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{tch.name}</h3>
                        <p className="text-xs text-purple-800 font-medium">{tch.department}</p>
                      </div>
                    </div>

                    {/* Active / Inactive Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 font-medium">
                    {tch.designation}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px] text-slate-700 truncate">{tch.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{tch.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {/* Test Dispatch or Switch Role */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenDirectEmail(tch)}
                      disabled={!isActive}
                      className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-900 hover:bg-purple-100 rounded-lg flex items-center gap-1 border border-purple-200 transition-colors disabled:opacity-40"
                      title="Send Direct Email"
                    >
                      <Send className="w-3 h-3" />
                      <span>Direct Email</span>
                    </button>

                    <button
                      onClick={() => loginAs('teacher', tch)}
                      className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      title="Switch login session to this teacher"
                    >
                      Test Login
                    </button>
                  </div>

                  {/* Principal Actions */}
                  {isPrincipal && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(tch.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isActive
                            ? 'text-emerald-700 hover:bg-emerald-50'
                            : 'text-slate-400 hover:bg-slate-100'
                        }`}
                        title={isActive ? 'Deactivate from Dispatches' : 'Activate for Dispatches'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(tch)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                        title="Edit Faculty Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tch.id)}
                        className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="Delete Faculty Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Direct Email Modal */}
      {isEmailModalOpen && emailRecipient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-900" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">Direct Faculty Email Dispatch</h2>
                  <p className="text-xs text-slate-500">To: {emailRecipient.name} ({emailRecipient.email})</p>
                </div>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendDirectEmail} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  required
                  rows={5}
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-800"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-[11px] flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-900 shrink-0" />
                <span>This message will be processed through the institutional SMTP server and recorded in the audit log.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Transmitting...' : 'Send Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Faculty Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-800" />
                <span>{editingItem ? 'Edit Faculty Member' : 'Register New Faculty'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Chander"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="r.chander@schoolsmarthub.edu"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-purple-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Department</label>
                  <input
                    type="text"
                    required
                    value={formDepartment}
                    onChange={e => setFormDepartment(e.target.value)}
                    placeholder="Mathematics, Physics, English..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formDesignation}
                    onChange={e => setFormDesignation(e.target.value)}
                    placeholder="Senior Faculty / HOD"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  placeholder="+91 98201 12345"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-800"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={e => setFormActive(e.target.checked)}
                    className="rounded text-purple-800 focus:ring-purple-800 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Active Status (Eligible for Broadcast Dispatches)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      When checked, this teacher will receive all mass communications and circular notifications.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingItem ? 'Update Faculty' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
