import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { medicationApi, diaryApi } from '../api/services';
import type { Medication, SymptomDiary } from '../api/services';
import {
  ScanLine,
  CheckCircle2,
  Clock,
  Clock4,
  Pill,
  ChevronRight,
  Lightbulb,
  Check,
  Plus,
  Flame,
  Moon,
  Utensils,
  Smile,
} from 'lucide-react';

export default function MedicationPage() {
  const { userId } = useApp();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [diaries, setDiaries] = useState<SymptomDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({
    medicine_name: '',
    dosage: '',
    frequency: '',
    reminder_time: '',
  });

  const loadData = async () => {
    try {
      const [meds, diaries] = await Promise.all([
        medicationApi.list(userId).catch(() => []),
        diaryApi.list(userId).catch(() => []),
      ]);
      setMedications(meds);
      setDiaries(diaries);
    } catch {
      setMedications([]);
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleAddMedication = async () => {
    if (!newMed.medicine_name || !newMed.dosage || !newMed.frequency) return;
    await medicationApi.add({
      user_id: userId,
      ...newMed,
    });
    setNewMed({ medicine_name: '', dosage: '', frequency: '', reminder_time: '' });
    setShowAddForm(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await medicationApi.remove(id);
    await loadData();
  };

  const tips = [
    '二甲双胍建议餐中或餐后服用，可减少胃肠不适。',
    '奥美拉唑需在早餐前30分钟空腹服用，效果最佳。',
    '阿托伐他汀建议每晚固定时间服用，保持血药浓度稳定。',
  ];

  return (
    <main className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-semibold text-foreground">药物管理</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary gap-1.5 py-2"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">添加</span>
          </button>
        </div>
      </header>

      {/* Add Medication Form */}
      {showAddForm && (
        <section className="px-4 pt-4">
          <div className="card space-y-3">
            <h3 className="text-sm font-semibold text-foreground">添加药物</h3>
            <input
              placeholder="药物名称"
              className="input"
              value={newMed.medicine_name}
              onChange={(e) => setNewMed({ ...newMed, medicine_name: e.target.value })}
            />
            <input
              placeholder="剂量 (如: 500mg)"
              className="input"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
            />
            <input
              placeholder="服用频率 (如: 每日两次)"
              className="input"
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
            />
            <input
              placeholder="提醒时间 (如: 08:00)"
              className="input"
              value={newMed.reminder_time}
              onChange={(e) => setNewMed({ ...newMed, reminder_time: e.target.value })}
            />
            <div className="flex gap-2">
              <button onClick={handleAddMedication} className="btn-primary flex-1">
                保存
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Today's Reminders Section */}
      <section className="px-4 pt-5 pb-1">
        <h2 className="text-base font-semibold text-foreground mb-3">今日服药提醒</h2>

        {medications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">暂无药物提醒</div>
        ) : (
          medications.map((med, index) => {
            const status =
              index === 0
                ? { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', label: '已服用' }
                : index === 1
                ? { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', label: '待服用' }
                : { icon: Clock4, bg: 'bg-muted', text: 'text-muted-foreground', label: '即将到时' };
            return (
              <div
                key={med.id}
                className="mb-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${status.bg}`}
                  >
                    <status.icon className={`h-5 w-5 ${status.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {med.reminder_time || '未设置'}
                      </span>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-md ${status.bg} px-2 py-0.5 text-xs font-medium ${status.text} whitespace-nowrap`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-foreground truncate">
                      {med.medicine_name} {med.dosage}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{med.frequency}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    删除
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* My Medications Section */}
      <section className="px-4 pt-4 pb-1">
        <h2 className="text-base font-semibold text-foreground mb-3">我的药品</h2>

        {medications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">暂无药品记录</div>
        ) : (
          medications.map((med) => (
            <div
              key={med.id}
              className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {med.medicine_name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {med.dosage} · {med.frequency}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          ))
        )}
      </section>

      {/* Symptom Diary Preview */}
      {diaries.length > 0 && (
        <section className="px-4 pt-4 pb-1">
          <h2 className="text-base font-semibold text-foreground mb-3">症状日记</h2>
          <div className="space-y-2">
            {diaries.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  {d.severity >= 7 ? (
                    <Flame className="h-4 w-4 text-destructive" />
                  ) : d.severity >= 4 ? (
                    <Moon className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Smile className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{d.symptom}</span>
                    <span className="inline-flex h-5 items-center rounded px-1.5 text-[10px] font-semibold bg-muted text-muted-foreground">
                      {d.severity}/10
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{d.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips Section */}
      <section className="px-4 pt-4 pb-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
            <h2 className="text-base font-semibold text-foreground">用药小贴士</h2>
          </div>
          <ul className="space-y-2.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="line-clamp-2">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
