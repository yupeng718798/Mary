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
  const [loading, setLoading] = useState(true);

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
        if (!cancelled) setLoading(false);
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
      label: '病历管理',
      desc: '上传与分析病历',
      path: '/records',
    },
    {
      icon: MapPin,
      label: '问诊导航',
      desc: '就医流程指引',
      path: '/consultation',
    },
    {
      icon: Pill,
      label: '药物管理',
      desc: '药品信息与提醒',
      path: '/medication',
    },
    {
      icon: BookOpen,
      label: '症状日记',
      desc: '每日健康记录',
      path: '/medication',
    },
  ];

  const pendingCount = records.filter((r) => r.status === 'pending').length;
  const nextReminder = medications[0]?.reminder_time || '暂无';

  return (
    <main className="pb-20">
      {/* Greeting Header */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              你好，{userName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">今天感觉怎么样？</p>
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
              ⚠️ 后端连接失败: {bootstrapError}
            </p>
          </div>
        </section>
      )}

      {/* Quick Action Grid (2x2) */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold tracking-tight mb-3 text-foreground">
          快捷功能
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
          健康概览
        </h2>
        <div className="flex flex-col gap-3">
          {/* 待分析报告 */}
          <button
            onClick={() => navigate('/records')}
            className="flex items-center gap-3 rounded-lg p-4 bg-card border border-border border-l-[3px] border-l-primary text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                待分析报告
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                {pendingCount > 0
                  ? `${pendingCount} 份报告等待 AI 分析`
                  : '暂无待分析报告'}
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

          {/* 今日服药提醒 */}
          <button
            onClick={() => navigate('/medication')}
            className="flex items-center gap-3 rounded-lg p-4 bg-card border border-border text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                今日服药提醒
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                {medications.length
                  ? `下次服药：${nextReminder}`
                  : '暂无药物提醒'}
              </p>
            </div>
            <div className="h-4 w-4 shrink-0 text-muted-foreground">›</div>
          </button>

          {/* 症状记录 */}
          <button
            onClick={() => navigate('/consultation')}
            className="flex items-center gap-3 rounded-lg p-4 bg-card border border-border text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                症状记录
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                {consultations.length
                  ? `${consultations.length} 条问诊记录`
                  : '记录症状，获得 AI 建议'}
              </p>
            </div>
            <div className="h-4 w-4 shrink-0 text-muted-foreground">›</div>
          </button>
        </div>
      </section>
    </main>
  );
}
