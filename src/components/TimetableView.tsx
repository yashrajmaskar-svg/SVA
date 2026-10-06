import React, { useState, useEffect } from 'react';
import { TimetableEntry, Weekday, Teacher } from '../types';
import {
  getTimetable,
  saveTimetableEntry,
  deleteTimetableEntry,
  getTeachers,
} from '../services/schoolService';
import { useAuth } from '../context/AuthContext';
import {
  CalendarRange,
  Plus,
  Search,
  BookOpen,
  User,
  MapPin,
  Clock,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  Filter,
} from 'lucide-react';

const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetableView: React.FC = () => {
  const { isPrincipal } = useAuth();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDay, setSelectedDay] = useState<Weekday | 'All'>('Monday');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [teacherFilter, setTeacherFilter] = useState<string>('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimetableEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formDay, setFormDay] = useState<Weekday>('Monday');
  const [formPeriod, setFormPeriod] = useState<number>(1);
  const [formTimeSlot, setFormTimeSlot] = useState('08:30 AM - 09:15 AM');
  const [formGradeClass, setFormGradeClass] = useState('Grade 10-A');
  const [formSubject, setFormSubject] = useState('Mathematics');
  const [formTeacherName, setFormTeacherName] = useState('Mrs. Sunita Deshmukh');
  const [formRoom, setFormRoom] = useState('Room 204');

  const loadData = async () => {
    setLoading(true);
    try {
      const [ttData, tchData] = await Promise.all([getTimetable(), getTeachers()]);
      setEntries(ttData);
      setTeachers(tchData);
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
    setFormDay(selectedDay === 'All' ? 'Monday' : selectedDay);
    setFormPeriod(1);
    setFormTimeSlot('08:30 AM - 09:15 AM');
    setFormGradeClass('Grade 10-A');
    setFormSubject('Mathematics');
    setFormTeacherName(teachers[0]?.name || 'Mrs. Sunita Deshmukh');
    setFormRoom('Room 204');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TimetableEntry) => {
    setEditingItem(item);
    setFormDay(item.day);
    setFormPeriod(item.period);
    setFormTimeSlot(item.timeSlot);
    setFormGradeClass(item.gradeClass);
    setFormSubject(item.subject);
    setFormTeacherName(item.teacherName);
    setFormRoom(item.room);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formTeacherName.trim()) return;

    const itemToSave: TimetableEntry = {
      id: editingItem ? editingItem.id : `tt-${Date.now()}`,
      day: formDay,
      period: Number(formPeriod),
      timeSlot: formTimeSlot.trim(),
      gradeClass: formGradeClass.trim(),
      subject: formSubject.trim(),
      teacherName: formTeacherName.trim(),
      room: formRoom.trim(),
    };

    await saveTimetableEntry(itemToSave);
    setIsModalOpen(false);
    await loadData();
    showToast(editingItem ? 'Period schedule updated' : 'New period entry added!');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this timetable period slot?')) {
      await deleteTimetableEntry(id);
      await loadData();
      showToast('Period entry removed.');
    }
  };

  // Distinct classes for filter
  const distinctClasses = Array.from(new Set(entries.map(e => e.gradeClass))).sort();

  const filteredEntries = entries.filter(e => {
    const matchDay = selectedDay === 'All' || e.day === selectedDay;
    const matchClass = classFilter === 'All' || e.gradeClass === classFilter;
    const matchTeacher = teacherFilter === 'All' || e.teacherName === teacherFilter;
    return matchDay && matchClass && matchTeacher;
  }).sort((a, b) => a.period - b.period);

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
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              4. Master Academic Timetable
            </h1>
            <p className="text-xs text-slate-500">
              {isPrincipal
                ? 'Configure daily period schedules, assign faculty, rooms, and class routines'
                : 'Interactive weekly schedule across Monday through Saturday periods'}
            </p>
          </div>
        </div>

        {isPrincipal && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Period Slot</span>
          </button>
        )}
      </div>

      {/* Day Selector Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex overflow-x-auto gap-1">
        {WEEKDAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              selectedDay === day
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {day}
          </button>
        ))}
        <button
          onClick={() => setSelectedDay('All')}
          className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-colors ${
            selectedDay === 'All'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Days
        </button>
      </div>

      {/* Class and Teacher Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-600">Filter Class:</span>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 focus:ring-2 focus:ring-indigo-700"
            >
              <option value="All">All Classes ({entries.length} slots)</option>
              {distinctClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Filter Teacher:</span>
            <select
              value={teacherFilter}
              onChange={e => setTeacherFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 focus:ring-2 focus:ring-indigo-700 max-w-xs"
            >
              <option value="All">All Faculty</option>
              {teachers.map(t => (
                <option key={t.id} value={t.name}>{t.name} ({t.department})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredEntries.length}</strong> period slots for{' '}
          <strong className="text-indigo-900">{selectedDay}</strong>
        </div>
      </div>

      {/* Timetable Period Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            Loading timetable...
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CalendarRange className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No scheduled periods found</h3>
            <p className="text-xs text-slate-400 mt-1">Try changing day or class filters, or add a period slot.</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* Period Badge */}
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700">Period</span>
                  <span className="text-lg font-black leading-none">{entry.period}</span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {entry.subject}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900">
                      {entry.gradeClass}
                    </span>
                    {selectedDay === 'All' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {entry.day}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{entry.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{entry.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{entry.room}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Principal Actions */}
              {isPrincipal && (
                <div className="flex items-center gap-1 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(entry)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                    title="Edit Period Slot"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    title="Delete Period Slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-indigo-700" />
                <span>{editingItem ? 'Edit Period Slot' : 'Add Timetable Period'}</span>
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
                  <label className="block font-semibold text-slate-700 mb-1">Weekday *</label>
                  <select
                    value={formDay}
                    onChange={e => setFormDay(e.target.value as Weekday)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-700 bg-white"
                  >
                    {WEEKDAYS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Period Number *</label>
                  <select
                    value={formPeriod}
                    onChange={e => setFormPeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-700 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                      <option key={p} value={p}>Period {p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={formTimeSlot}
                    onChange={e => setFormTimeSlot(e.target.value)}
                    placeholder="08:30 AM - 09:15 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade / Class</label>
                  <input
                    type="text"
                    required
                    value={formGradeClass}
                    onChange={e => setFormGradeClass(e.target.value)}
                    placeholder="Grade 10-A"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  placeholder="e.g. Mathematics, Advanced Physics, English"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Teacher</label>
                  <select
                    value={formTeacherName}
                    onChange={e => setFormTeacherName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-700 bg-white"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room / Lab</label>
                  <input
                    type="text"
                    required
                    value={formRoom}
                    onChange={e => setFormRoom(e.target.value)}
                    placeholder="Room 204 / Physics Lab"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-700"
                  />
                </div>
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
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingItem ? 'Update Period' : 'Save Period'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
