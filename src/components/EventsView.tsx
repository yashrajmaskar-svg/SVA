import React, { useState, useEffect } from 'react';
import { SchoolEvent } from '../types';
import { getEvents, saveEvent, deleteEvent } from '../services/schoolService';
import { useAuth } from '../context/AuthContext';
import {
  CalendarDays,
  Plus,
  Search,
  MapPin,
  Clock,
  User,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { isPrincipal } = useAuth();
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SchoolEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEventDate, setFormEventDate] = useState('');
  const [formStartTime, setFormStartTime] = useState('09:00 AM');
  const [formEndTime, setFormEndTime] = useState('12:00 PM');
  const [formLocation, setFormLocation] = useState('Main Auditorium');
  const [formCategory, setFormCategory] = useState<SchoolEvent['category']>('Academic');
  const [formOrganizer, setFormOrganizer] = useState('School Academic Council');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
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
    setFormTitle('');
    setFormDescription('');
    setFormEventDate(new Date().toISOString().split('T')[0]);
    setFormStartTime('09:00 AM');
    setFormEndTime('01:00 PM');
    setFormLocation('Main Auditorium');
    setFormCategory('Academic');
    setFormOrganizer('Academic Committee');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: SchoolEvent) => {
    setEditingItem(evt);
    setFormTitle(evt.title);
    setFormDescription(evt.description);
    setFormEventDate(evt.eventDate);
    setFormStartTime(evt.startTime);
    setFormEndTime(evt.endTime);
    setFormLocation(evt.location);
    setFormCategory(evt.category);
    setFormOrganizer(evt.organizer);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formEventDate) return;

    const itemToSave: SchoolEvent = {
      id: editingItem ? editingItem.id : `evt-${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim(),
      eventDate: formEventDate,
      startTime: formStartTime.trim(),
      endTime: formEndTime.trim(),
      location: formLocation.trim(),
      category: formCategory,
      organizer: formOrganizer.trim(),
    };

    await saveEvent(itemToSave);
    setIsModalOpen(false);
    await loadData();
    showToast(editingItem ? 'Event updated successfully' : 'New event added to calendar!');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
      await loadData();
      showToast('Event removed.');
    }
  };

  const filtered = events.filter(evt => {
    const matchSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || evt.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const getCategoryColor = (cat: SchoolEvent['category']) => {
    switch (cat) {
      case 'Exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Sports':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cultural':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

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
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              3. Academic Calendar & School Events
            </h1>
            <p className="text-xs text-slate-500">
              {isPrincipal
                ? 'Schedule academic milestones, examinations, athletic meets, and committee conferences'
                : 'Official academic calendar schedule, upcoming school functions, and examination dates'}
            </p>
          </div>
        </div>

        {isPrincipal && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs w-full sm:w-auto">
          {['all', 'Academic', 'Exam', 'Cultural', 'Sports', 'Meeting'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Events' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            Loading events...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No events scheduled</h3>
            <p className="text-xs text-slate-400 mt-1">Try selecting another filter or add a new event.</p>
          </div>
        ) : (
          filtered.map(evt => {
            const eventDateObj = new Date(evt.eventDate);
            const monthName = eventDateObj.toLocaleString('default', { month: 'short' });
            const dayNum = eventDateObj.getDate();
            const yearNum = eventDateObj.getFullYear();
            const dayName = eventDateObj.toLocaleDateString('default', { weekday: 'short' });

            return (
              <div
                key={evt.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-4"
              >
                {/* Date Badge */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center shrink-0 w-18 sm:w-20">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {monthName} {yearNum}
                  </span>
                  <span className="block text-2xl font-black text-emerald-950 leading-tight">
                    {dayNum}
                  </span>
                  <span className="block text-[10px] font-semibold text-emerald-700">
                    {dayName}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getCategoryColor(
                        evt.category
                      )}`}
                    >
                      {evt.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.startTime} – {evt.endTime}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Host: <strong className="text-slate-700">{evt.organizer}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Principal Actions */}
                {isPrincipal && (
                  <div className="flex sm:flex-col items-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                      title="Edit Event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-700" />
                <span>{editingItem ? 'Edit Event' : 'Schedule New Event'}</span>
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
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Annual Inter-House Science Olympiad"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formEventDate}
                    onChange={e => setFormEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as SchoolEvent['category'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exam">Examination</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Meeting">Meeting / Conference</option>
                    <option value="Holiday">Institutional Holiday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    placeholder="01:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue / Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    placeholder="Main Auditorium, Ground, etc."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organizing Committee</label>
                  <input
                    type="text"
                    value={formOrganizer}
                    onChange={e => setFormOrganizer(e.target.value)}
                    placeholder="e.g. Science Faculty"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Description & Notes</label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Outline participation guidelines, schedule breakdown..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
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
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingItem ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
