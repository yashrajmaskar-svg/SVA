import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Teacher } from '../types';
import { getTeachers } from '../services/schoolService';
import {
  Shield,
  GraduationCap,
  X,
  Check,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const RoleSwitcherModal: React.FC = () => {
  const { profile, isPrincipal, loginAs, isSwitchModalOpen, setIsSwitchModalOpen } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    if (isSwitchModalOpen) {
      getTeachers().then(setTeachers);
    }
  }, [isSwitchModalOpen]);

  if (!isSwitchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-900" />
              <span>Switch Portal Identity / Role</span>
            </h2>
            <p className="text-xs text-slate-500">
              Test both administrative control and faculty viewports
            </p>
          </div>
          <button
            onClick={() => setIsSwitchModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Principal Option */}
          <div
            onClick={() => loginAs('principal')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              isPrincipal
                ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/20'
                : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Dr. Rajeshwar Sharma</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      Principal
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Administrator Portal • Full Control (Create, Edit, Delete, Dispatch)
                  </p>
                </div>
              </div>

              {isPrincipal ? (
                <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              ) : (
                <ArrowRight className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Or Switch to a Faculty Member (Teacher View):
            </span>

            <div className="space-y-2">
              {teachers.map(tch => {
                const isSelected = profile?.id === tch.id;

                return (
                  <div
                    key={tch.id}
                    onClick={() => loginAs('teacher', tch)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-700 bg-indigo-50/70 ring-2 ring-indigo-700/20'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs shrink-0">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-slate-900 truncate">{tch.name}</h4>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                              {tch.department}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{tch.email}</p>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsSwitchModalOpen(false)}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
