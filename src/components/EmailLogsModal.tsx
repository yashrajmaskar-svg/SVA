import React, { useState, useEffect } from 'react';
import { EmailLog } from '../types';
import { getEmailLogs, clearEmailLogs } from '../services/schoolService';
import {
  X,
  MailCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Clock,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface EmailLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailLogsModal: React.FC<EmailLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed'>('all');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getEmailLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load email logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalLogs = logs.length;
  const sentLogs = logs.filter(l => l.status === 'sent').length;
  const failedLogs = logs.filter(l => l.status === 'failed').length;
  const successRate = totalLogs > 0 ? Math.round((sentLogs / totalLogs) * 100) : 100;

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear all email audit records?')) {
      await clearEmailLogs();
      setLogs([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
              <MailCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Email Dispatch & SMTP Audit Records</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live Monitor
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Audited transmission logs of all automatic notices and faculty email communications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100/70 border-b border-slate-200 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold uppercase">Total Dispatches</span>
            <span className="text-lg font-bold text-slate-900">{totalLogs}</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold uppercase">Successful Delivery</span>
            <span className="text-lg font-bold text-emerald-700">{sentLogs}</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold uppercase">Delivery Failures</span>
            <span className="text-lg font-bold text-red-600">{failedLogs}</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold uppercase">SMTP Success Rate</span>
            <span className="text-lg font-bold text-blue-900">{successRate}%</span>
          </div>
        </div>

        {/* Filters and search */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search recipient or subject..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 font-medium ${
                  statusFilter === 'all' ? 'bg-blue-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                All ({logs.length})
              </button>
              <button
                onClick={() => setStatusFilter('sent')}
                className={`px-3 py-1.5 font-medium ${
                  statusFilter === 'sent' ? 'bg-blue-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Sent ({sentLogs})
              </button>
              <button
                onClick={() => setStatusFilter('failed')}
                className={`px-3 py-1.5 font-medium ${
                  statusFilter === 'failed' ? 'bg-blue-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Failed ({failedLogs})
              </button>
            </div>

            <button
              onClick={loadLogs}
              title="Refresh logs"
              className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-white hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {logs.length > 0 && (
              <button
                onClick={handleClear}
                title="Clear logs"
                className="p-1.5 text-red-600 hover:text-red-800 border border-red-200 rounded-lg bg-white hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading audit records...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              <MailCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No email records found</p>
              <p className="text-slate-400 mt-1">Dispatches sent from announcements or the faculty roster will appear here.</p>
            </div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    log.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                  }`}>
                    {log.status === 'sent' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{log.recipientName}</span>
                      <span className="text-slate-500 text-[11px]">{`<${log.recipientEmail}>`}</span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                        {log.messageType}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium truncate mt-0.5">
                      {log.subject}
                    </p>
                    {log.errorMessage && (
                      <p className="text-[11px] text-red-600 mt-0.5">
                        Error: {log.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-[11px] text-slate-400 shrink-0">
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                    log.status === 'sent'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {log.status === 'sent' ? 'Delivered' : 'Failed'}
                  </span>
                  <span className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.sentAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                    {' · '}
                    {new Date(log.sentAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
            <span>Authenticated with TLS / DKIM compliant institutional mail relay</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
