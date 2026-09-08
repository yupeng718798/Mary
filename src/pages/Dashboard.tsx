import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Bell,
  FileText,
  MapPin,
  Pill,
  BookOpen,
  ClipboardList,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { medicalApi, consultationApi, medicationApi } from '../api/services';
import type { MedicalRecord, Consultation, Medication } from '../api/services';

export default function Dashboard() {
  const { userId, userName, bootstrapError } = useApp();
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [recs, cons, meds] = await Promise.all([
          medicalApi.list(userId).catch(() => []),
          consultationApi.list(userId).catch(() => []),
          medicationApi.list(userId).catch(() => []),
        ]);
        if (cancelled) return;
        setRecords(recs);
        setConsultations(cons);
        setMedications(meds);
      } finally {
        // loaded
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const quickActions = [
    {
      icon: FileText,
      label: 'Medical Records',
      desc: 'Upload & analyze records',
      path: '/records',
    },
    {
      icon: MapPin,
      label: 'Consultation',
      desc: 'Visit navigation guide',
      path: '/consultation',
    },
    {
      icon: Pill,
      label: 'Medications',
      desc: 'Drug info & reminders',
      path: '/medication',
    },
    {
      icon: BookOpen,
      label: 'Symptom Diary',
      desc: 'Daily health log',
      path: '/medication',
    },
  ];

  const pendingCount = records.filter((r) => r.status === 'pending').length;
  const nextReminder = medications[0]?.reminder_time || 'None';

  return (
    <main className="pb-20">
      {/* Greeting Header */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Hello, {userName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">How are you feeling today?</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
            <Bell className="h-5 w-5 text-primary" />
          </div>
        </div>
      </section>

      {/* Backend Error Banner */}
      {bootstrapError && (
        <section className="px-4 mt-3">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
            <p className="text-xs text-destructive">
              Backend connection failed: {bootstrapError}
            </p>
          </div>
        </section>
      )}

      {/* Quick Action Grid (2x2) */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold tracking-tight mb-3 text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-start rounded-lg p-4 transition-transform duration-150 hover:-translate-y-0.5 bg-card border border-border text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <action.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 text-sm font-semibold truncate w-full text-foreground">
                {action.label}
              </h3>
              <p className="mt-0.5 text-xs truncate w-full text-muted-foreground">
                {action.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Health Summary Section */}
      <section className="px-4 mt-6">
        <h2 className="text-base font-semibold tracking-tight mb-3 text-foreground">
          Health Overview
        </h2>
        <div className="flex flex-col gap-3">
          {/* Pending Analysis */}
          <button
            onClick={() => navigate('/records')}
            className="flex items-center gap-3 rounded-lg p-4 bg-card border border-border border-l-[3px] border-l-primary text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                Pending Analysis
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                {pendingCount > 0
                  ? `${pendingCount} report(s) awaiting AI analysis`
                  : 'No pending reports'}
              </p>
            </div>
            {pendingCount > 0 && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                <span className="text-xs font-semibold text-primary-foreground">
                  {pendingCount}
                </span>
              </div>
            )}
          </button>

          {/* Today's Medication Reminders */}
          <button
            onClick={() => navigate('/medication')}
            className="flex items-center gap-3 rounded-lg p-4 bg-card border border-border text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                Today's Medication
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                {medications.length
                  ? `Next dose: ${nextReminder}`
                  : 'No medication reminders'}
              </p>
            </div>
            <div className="h-4 w-4 shrink-0 text-muted-foreground">›</div>
          </button>

          {/* Symptom Records */}
          <button
            onClick={() => navigate('/consultation')}
            className="flex items-center gap-3 rounded-lg p-4 bg-card border border-border text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                Symptom Log
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                {consultations.length
                  ? `${consultations.length} consultation record(s)`
                  : 'Log symptoms, get AI advice'}
              </p>
            </div>
            <div className="h-4 w-4 shrink-0 text-muted-foreground">›</div>
          </button>
        </div>
      </section>
    </main>
  );
}
