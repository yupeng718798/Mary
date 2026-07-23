import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { profileApi, medicalApi, medicationApi, diaryApi } from '../api/services';
import type { Profile as ProfileType } from '../api/services';
import {
  FileText,
  Pill,
  Calendar,
  Globe,
  Bell,
  Download,
  Shield,
  Info,
  ChevronRight,
  Edit2,
  Check,
  X,
} from 'lucide-react';

export default function ProfilePage() {
  const { userId, userName } = useApp();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [stats, setStats] = useState({ records: 0, medications: 0, diaries: 0 });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<ProfileType>>({});

  const loadData = async () => {
    try {
      const [prof, recs, meds, diaries] = await Promise.all([
        profileApi.get(userId).catch(() => null),
        medicalApi.list(userId).catch(() => []),
        medicationApi.list(userId).catch(() => []),
        diaryApi.list(userId).catch(() => []),
      ]);
      setProfile(prof);
      setForm(prof || {});
      setStats({
        records: recs.length,
        medications: meds.length,
        diaries: diaries.length,
      });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleSave = async () => {
    if (!profile) {
      await profileApi.create({ ...form, id: userId });
    } else {
      await profileApi.update(userId, form);
    }
    setEditing(false);
    await loadData();
  };

  const displayName = profile?.full_name || userName || '用户';
  const email = profile?.emergency_contact || 'user@email.com';

  const statItems = [
    { icon: FileText, label: '病历', count: stats.records },
    { icon: Pill, label: '药品', count: stats.medications },
    { icon: Calendar, label: '记录', count: stats.diaries },
  ];

  const settings = [
    { icon: Globe, label: '语言设置', value: '中文' },
    { icon: Bell, label: '通知提醒', toggle: true },
    { icon: Download, label: '数据导出', value: '导出健康档案' },
    { icon: Shield, label: '隐私设置' },
    { icon: Info, label: '关于 Mary', value: '版本 1.0.0' },
  ];

  return (
    <main className="pb-20">
      {/* Profile Header */}
      <section className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
            {displayName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  className="input"
                  placeholder="姓名"
                  value={form.full_name || ''}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="紧急联系人/邮箱"
                  value={form.emergency_contact || ''}
                  onChange={(e) =>
                    setForm({ ...form, emergency_contact: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="btn-primary gap-1 py-1.5 text-xs">
                    <Check className="h-3 w-3" /> 保存
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm(profile || {});
                    }}
                    className="btn-secondary gap-1 py-1.5 text-xs"
                  >
                    <X className="h-3 w-3" /> 取消
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-foreground truncate">
                    {displayName}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground truncate">{email}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Health Stats Row */}
      <section className="px-4 pb-5">
        <div className="grid grid-cols-3 gap-3">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-lg border border-border bg-card px-3 py-4"
            >
              <item.icon className="mb-1.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-lg font-semibold text-foreground whitespace-nowrap">
                {item.count} {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Settings List */}
      <section className="px-4 pb-5">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground tracking-wide">
          设置
        </h2>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {settings.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                index < settings.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 text-sm text-foreground truncate">
                {item.label}
              </span>
              {item.toggle ? (
                <button
                  type="button"
                  className="relative h-6 w-11 shrink-0 rounded-full bg-primary transition-colors"
                >
                  <span className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
                </button>
              ) : (
                <>
                  {item.value && (
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {item.value}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Logout Button */}
      <section className="px-4 pb-8">
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-lg border border-destructive bg-transparent px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 active:bg-destructive/10"
        >
          退出登录
        </button>
      </section>
    </main>
  );
}
