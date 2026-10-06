import React, { useState, useEffect } from 'react';
import { Circular, SchoolSettings } from '../types';
import { getCirculars, saveCircular, deleteCircular, getSettings } from '../services/schoolService';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Plus,
  Search,
  Printer,
  Trash2,
  Edit2,
  Eye,
  Calendar,
  X,
  Building,
  CheckCircle,
  Download,
  Stamp,
  Award,
} from 'lucide-react';

export const CircularsView: React.FC = () => {
  const { isPrincipal } = useAuth();
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Circular | null>(null);
  const [viewingItem, setViewingItem] = useState<Circular | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formRefNo, setFormRefNo] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCategory, setFormCategory] = useState<Circular['category']>('Academic');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formSignedBy, setFormSignedBy] = useState('');
  const [formFileName, setFormFileName] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [circData, settData] = await Promise.all([getCirculars(), getSettings()]);
      setCirculars(circData);
      setSettings(settData);
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
    const dateStr = new Date().toISOString().split('T')[0];
    const seq = Math.floor(100 + Math.random() * 900);
    setFormRefNo(`CIR/ADM/2026/${seq}`);
    setFormTitle('');
    setFormDate(dateStr);
    setFormCategory('Academic');
    setFormSummary('');
    setFormContent('');
    setFormSignedBy(settings?.principalName || 'Dr. Rajeshwar Sharma, Principal');
    setFormFileName(`Circular_2026_${seq}.pdf`);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (circ: Circular) => {
    setEditingItem(circ);
    setFormRefNo(circ.refNo);
    setFormTitle(circ.title);
    setFormDate(circ.date);
    setFormCategory(circ.category);
    setFormSummary(circ.summary);
    setFormContent(circ.content);
    setFormSignedBy(circ.signedBy);
    setFormFileName(circ.fileName || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const itemToSave: Circular = {
      id: editingItem ? editingItem.id : `circ-${Date.now()}`,
      refNo: formRefNo.trim(),
      title: formTitle.trim(),
      date: formDate,
      category: formCategory,
      summary: formSummary.trim(),
      content: formContent.trim(),
      signedBy: formSignedBy.trim(),
      fileName: formFileName.trim() || undefined,
      published: true,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
    };

    await saveCircular(itemToSave);
    setIsModalOpen(false);
    await loadData();
    showToast(editingItem ? 'Circular updated successfully' : 'New circular published!');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this official circular?')) {
      await deleteCircular(id);
      await loadData();
      showToast('Circular removed.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filtered = circulars.filter(circ => {
    const matchSearch =
      circ.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circ.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circ.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || circ.category === categoryFilter;
    return matchSearch && matchCategory;
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

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              2. Official School Circulars
            </h1>
            <p className="text-xs text-slate-500">
              {isPrincipal
                ? 'Issue official institutional directives, administrative notifications, and policy memos'
                : 'Official policy notifications and regulatory directives issued by the Principal Secretariat'}
            </p>
          </div>
        </div>

        {isPrincipal && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Circular</span>
          </button>
        )}
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars by Ref No or title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs w-full sm:w-auto">
          {['all', 'Academic', 'Administrative', 'Examination', 'General'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Circulars' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Circulars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            Loading circulars...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No circulars found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or issuing a new circular.</p>
          </div>
        ) : (
          filtered.map(circ => (
            <div
              key={circ.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {circ.refNo}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(circ.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {circ.category}
                  </span>
                  <h3
                    onClick={() => setViewingItem(circ)}
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-amber-700 cursor-pointer mt-1.5 leading-snug"
                  >
                    {circ.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {circ.summary || circ.content}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                  Signatory: <strong>{circ.signedBy}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingItem(circ)}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Memo</span>
                  </button>

                  {isPrincipal && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(circ)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="Edit Circular"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(circ.id)}
                        className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="Delete Circular"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Circular Printable Memo Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Top Toolbar */}
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Official Institutional Circular Preview</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Circular</span>
                </button>
                <button
                  onClick={() => setViewingItem(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body (Authentic Letterhead Style) */}
            <div className="p-8 sm:p-12 overflow-y-auto bg-white font-serif text-slate-900 space-y-6">
              
              {/* Institutional Header */}
              <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-950 text-amber-400 flex items-center justify-center font-sans font-bold text-2xl shadow-xs mb-2">
                  🏛️
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider font-sans text-blue-950">
                  {settings?.institutionName || "ST. XAVIER'S INTERNATIONAL ACADEMY"}
                </h1>
                <p className="text-xs font-sans text-slate-600">
                  {settings?.schoolAddress || 'Heritage Campus, Institutional Area, New Delhi'}
                </p>
                <p className="text-[11px] font-sans text-slate-500">
                  Affiliation No: {settings?.affiliationNumber || 'CBSE/AFF/2130894'} | Academic Session: {settings?.academicYear || '2026-2027'}
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-0.5 bg-slate-900 text-white font-sans text-xs font-bold uppercase tracking-widest">
                    OFFICIAL CIRCULAR / NOTIFICATION
                  </span>
                </div>
              </div>

              {/* Reference & Date strip */}
              <div className="flex items-center justify-between text-xs font-sans font-semibold border-b border-slate-200 pb-3 text-slate-700">
                <div>
                  Ref No: <span className="font-mono text-slate-900">{viewingItem.refNo}</span>
                </div>
                <div>
                  Date: {new Date(viewingItem.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Circular Subject */}
              <div className="pt-2">
                <p className="font-sans text-xs uppercase tracking-wider font-bold text-slate-500">Subject:</p>
                <h2 className="text-base sm:text-lg font-bold font-sans text-slate-900 mt-1">
                  {viewingItem.title}
                </h2>
              </div>

              {/* Body */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-3 font-serif">
                {viewingItem.content}
              </div>

              {/* Official Seal and Signature */}
              <div className="pt-10 flex items-end justify-between font-sans">
                <div className="border border-blue-900/30 rounded-xl p-3 bg-blue-50/40 text-center w-36">
                  <Stamp className="w-8 h-8 text-blue-900/60 mx-auto" />
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-950 mt-1">
                    OFFICIAL SEAL
                  </span>
                  <span className="text-[8px] text-slate-500">DIRECTORATE</span>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-serif italic text-base text-blue-950 font-bold">
                    {viewingItem.signedBy}
                  </div>
                  <div className="text-xs font-bold text-slate-900 uppercase">
                    Head of Institution / Principal
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {settings?.institutionName || "St. Xavier's International Academy"}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Circular Modal (Principal only) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>{editingItem ? 'Edit Circular' : 'Draft Official Circular'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reference Number *</label>
                  <input
                    type="text"
                    required
                    value={formRefNo}
                    onChange={e => setFormRefNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as Circular['category'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Examination">Examination</option>
                    <option value="General">General</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Signatory Authority</label>
                  <input
                    type="text"
                    required
                    value={formSignedBy}
                    onChange={e => setFormSignedBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Circular Subject / Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Mandatory Implementation of Digital Lesson Logs"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Summary (Overview)</label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={e => setFormSummary(e.target.value)}
                  placeholder="Short one-line summary for the portal list"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Complete Circular Text / Body *</label>
                <textarea
                  required
                  rows={6}
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  placeholder="Official memorandum text, directives, numbered clauses..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 font-sans"
                />
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingItem ? 'Update Circular' : 'Publish Circular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
