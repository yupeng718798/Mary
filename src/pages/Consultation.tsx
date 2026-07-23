import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { consultationApi } from '../api/services';
import type { Consultation } from '../api/services';
import {
  Send,
  CheckCircle,
  Circle,
  MessageCircle,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export default function ConsultationPage() {
  const { userId } = useApp();
  const [symptoms, setSymptoms] = useState('');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const loadConsultations = async () => {
    try {
      const cons = await consultationApi.list(userId);
      setConsultations(cons);
    } catch {
      setConsultations([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [userId]);

  const handleSubmit = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      await consultationApi.create(userId, symptoms);
      setSymptoms('');
      await loadConsultations();
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: CheckCircle, label: '预约 GP', desc: '建议首先预约全科医生', active: true },
    { icon: Circle, label: 'GP 初步评估', desc: '医生初步诊断', active: false },
    { icon: Circle, label: '专科转诊', desc: '如需要获得 Specialist Referral', active: false },
    { icon: Circle, label: '专科检查', desc: '后续进行专科检查', active: false },
  ];

  const checklist = [
    '症状持续时间',
    '检查报告',
    '当前药物列表',
    '既往病史',
  ];

  return (
    <main className="min-h-screen pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex h-14 items-center px-4">
          <h1 className="text-[17px] font-semibold text-foreground">问诊导航</h1>
        </div>
      </header>

      <div className="space-y-4 px-4 pt-4">
        {/* Symptom Input Card */}
        <section className="card">
          <label htmlFor="symptom-input" className="mb-2 block text-sm font-semibold text-foreground">
            症状描述
          </label>
          <textarea
            id="symptom-input"
            placeholder="描述你的症状..."
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="input resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !symptoms.trim()}
            className="btn-primary mt-3 w-full gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>分析症状</span>
          </button>
        </section>

        {/* AI Questions Result */}
        {consultations.length > 0 && consultations[0].ai_questions && (
          <section className="card border-l-[3px] border-l-primary">
            <h2 className="mb-2 text-sm font-semibold text-foreground">Mary AI 建议询问的问题</h2>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {consultations[0].ai_questions}
            </div>
          </section>
        )}

        {/* Healthcare Flow Stepper */}
        <section className="card">
          <h2 className="mb-4 text-sm font-semibold text-foreground">就诊流程</h2>
          <div className="flex flex-col">
            {steps.map((step, index) => (
              <div key={step.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.active ? 'bg-primary-50' : 'bg-muted'
                    }`}
                  >
                    <step.icon
                      className={`h-4 w-4 ${
                        step.active ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>
                <div className={`min-w-0 flex-1 ${index < steps.length - 1 ? 'pb-5' : ''}`}>
                  <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Preparation Checklist */}
        <section className="card">
          <h2 className="mb-3 text-sm font-semibold text-foreground">看诊准备清单</h2>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Mock Consultation CTA Card */}
        <button className="flex w-full items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 p-4 transition-colors active:bg-primary-100 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">模拟问诊</p>
            <p className="mt-0.5 text-xs text-muted-foreground">提前和 Mary 练习问诊</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        {/* Consultation History */}
        {consultations.length > 0 && (
          <section className="card">
            <h2 className="mb-3 text-sm font-semibold text-foreground">问诊记录</h2>
            <div className="space-y-2">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate text-foreground">
                      {c.symptoms}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('zh-CN') : ''}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                      c.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {c.status === 'completed' ? '已完成' : '进行中'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
