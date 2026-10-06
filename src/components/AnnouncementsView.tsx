import React, { useState, useEffect } from 'react';
import { Announcement, PriorityLevel } from '../types';
import {
  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  dispatchNotificationEmail,
} from '../services/schoolService';
import { useAuth } from '../context/AuthContext';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Send,
  Trash2,
  Edit2,
  Clock,
  CheckCircle,
  Eye,
  AlertCircle,
  X,
  Sparkles,
  Users,
} from 'lucide-react';

interface AnnouncementsViewProps {
  onOpenEmailLogs: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ onOpenEmailLogs }) => {
  const { isPrincipal, profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [viewingItem, setViewingItem] = useState<Announcement | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formPriority, setFormPriority] = useState<PriorityLevel>('Important');
  const [formAudience, setFormAudience] = useState('All Faculty');
  const [formPublished, setFormPublished] = useState(true);
  const [formSendEmail, setFormSendEmail] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements(isPrincipal);
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isPrincipal]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormMessage('');
    setFormPriority('Important');
    setFormAudience('All Faculty');
    setFormPublished(true);
    setFormSendEmail(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingItem(ann);
    setFormTitle(ann.title);
    setFormMessage(ann.message);
    setFormPriority(ann.priority);
    setFormAudience(ann.targetAudience);
    setFormPublished(ann.published);
    setFormSendEmail(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) return;

    const itemToSave: Announcement = {
      id: editingItem ? editingItem.id : `ann-${Date.now()}`,
      title: formTitle.trim(),
      message: formMessage.trim(),
      priority: formPriority,
      targetAudience: formAudience,
      published: formPublished,
      sendEmailNotification: formSendEmail,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      author: editingItem ? editingItem.author : (profile?.name || 'Dr. Rajeshwar Sharma, Principal'),
    };

    await saveAnnouncement(itemToSave);
    setIsModalOpen(false);
    await loadData();
    showToast(
      formSendEmail && formPublished
        ? 'Announcement published & email broadcast dispatched!'
        : 'Announcement saved successfully!'
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement(id);
      await loadData();
      showToast('Announcement removed.');
    }
  };

  const handleTriggerBroadcast = async (ann: Announcement) => {
    setIsBroadcasting(true);
    try {
      const result = await dispatchNotificationEmail({
        title: ann.title,
        message: ann.message,
        type: 'announcement',
      });
      showToast(`Broadcast sent to ${result.deliveredCount} faculty members!`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const filtered = announcements.filter(item => {
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = selectedPriority === 'all' || item.priority.toLowerCase() === selectedPriority.toLowerCase();
    const matchAudience = selectedAudience === 'all' || item.targetAudience === selectedAudience;
    return matchSearch && matchPriority && matchAudience;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                1. School Announcements
              </h1>
              <p className="text-xs text-slate-500">
                {isPrincipal
                  ? 'Issue priority announcements, staff briefings, and automated email broadcasts'
                  : 'Faculty noticeboard for official school notifications and administrative directives'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPrincipal && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </button>
          )}
          <button
            onClick={onOpenEmailLogs}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Clock className="w-4 h-4 text-blue-900" />
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Priority filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold uppercase mr-1">Priority:</span>
            {['all', 'urgent', 'important', 'normal'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                  selectedPriority === p
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Audience filter */}
          <select
            value={selectedAudience}
            onChange={e => setSelectedAudience(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          >
            <option value="all">All Audiences</option>
            <option value="All Faculty">All Faculty</option>
            <option value="Primary Wing">Primary Wing</option>
            <option value="Secondary Wing">Secondary Wing</option>
            <option value="All Staff">All Staff</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            Loading announcements...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No announcements found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new notice.</p>
          </div>
        ) : (
          filtered.map(item => {
            const isUrgent = item.priority === 'Urgent';
            const isImportant = item.priority === 'Important';

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isUrgent
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : isImportant
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {item.priority}
                      </span>

                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        {item.targetAudience}
                      </span>

                      {!item.published && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                          Draft (Unpublished)
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3
                      onClick={() => setViewingItem(item)}
                      className="text-base font-bold text-slate-900 hover:text-blue-900 cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
                      {item.message}
                    </p>

                    <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400">
                      <span>Issued by: <strong className="text-slate-600 font-semibold">{item.author}</strong></span>
                      {item.sendEmailNotification && (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Email broadcast enabled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      onClick={() => setViewingItem(item)}
                      className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1"
                      title="Read Announcement"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sm:hidden font-medium">Read</span>
                    </button>

                    {isPrincipal && (
                      <>
                        <button
                          onClick={() => handleTriggerBroadcast(item)}
                          disabled={isBroadcasting}
                          className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg flex items-center gap-1 border border-blue-200 transition-colors"
                          title="Send Email Broadcast to All Active Faculty"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Email</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View Detail Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      viewingItem.priority === 'Urgent'
                        ? 'bg-red-100 text-red-800'
                        : viewingItem.priority === 'Important'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {viewingItem.priority}
                  </span>
                  <span className="text-xs text-slate-500">
                    Target: {viewingItem.targetAudience}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">{viewingItem.title}</h2>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {viewingItem.message}
              </p>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap justify-between gap-2">
                <div>
                  Issued by: <strong className="text-slate-800">{viewingItem.author}</strong>
                </div>
                <div>
                  Posted: {new Date(viewingItem.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {isPrincipal && (
                <button
                  onClick={() => {
                    handleTriggerBroadcast(viewingItem);
                  }}
                  className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Faculty Email Broadcast</span>
                </button>
              )}
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal (Principal only) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-900" />
                <span>{editingItem ? 'Edit Announcement' : 'Publish New Announcement'}</span>
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
                <label className="block font-semibold text-slate-700 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Schedule for Pre-Board Examination Duties"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    <option value="Urgent">Urgent (Immediate Attention)</option>
                    <option value="Important">Important (Action Needed)</option>
                    <option value="Normal">Normal (Information)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Faculty Audience
                  </label>
                  <select
                    value={formAudience}
                    onChange={e => setFormAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    <option value="All Faculty">All Faculty</option>
                    <option value="Primary Wing">Primary Wing (Classes 1-5)</option>
                    <option value="Secondary Wing">Secondary Wing (Classes 6-10)</option>
                    <option value="Senior Wing">Senior Wing (Classes 11-12)</option>
                    <option value="All Staff">All Academic & Admin Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Announcement Content / Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formMessage}
                  onChange={e => setFormMessage(e.target.value)}
                  placeholder="Provide detailed instructions, dates, required actions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900 font-sans"
                />
              </div>

              {/* Toggles */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={e => setFormPublished(e.target.checked)}
                    className="rounded text-blue-900 focus:ring-blue-900 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-800">
                    Publish immediately to Faculty Portal
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSendEmail}
                    onChange={e => setFormSendEmail(e.target.checked)}
                    className="rounded text-blue-900 focus:ring-blue-900 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-blue-900" />
                    <span>Dispatch automated email notification to all active faculty</span>
                  </span>
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
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingItem ? 'Update Announcement' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
