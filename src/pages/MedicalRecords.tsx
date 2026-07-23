import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { medicalApi } from '../api/services';
import type { MedicalRecord } from '../api/services';
import { Upload, FileText, Image, CheckCircle, Loader2, CloudUpload } from 'lucide-react';

export default function MedicalRecords() {
  const { userId } = useApp();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadRecords = async () => {
    try {
      const recs = await medicalApi.list(userId);
      setRecords(recs);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [userId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      formData.append('record_type', file.type.includes('pdf') ? 'pdf' : 'image');
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      const record = await medicalApi.upload(formData);
      await loadRecords();
      // 上传成功后自动分析
      if (record?.id) {
        handleAnalyze(record.id);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async (recordId: string) => {
    setAnalyzingId(recordId);
    try {
      await medicalApi.analyze(recordId);
      await loadRecords();
    } finally {
      setAnalyzingId(null);
    }
  };

  const getStatusBadge = (record: MedicalRecord) => {
    if (record.status === 'analyzed') {
      return (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-emerald-600">
          <CheckCircle className="h-3 w-3" />
          已分析
        </span>
      );
    }
    if (record.status === 'analyzing' || analyzingId === record.id) {
      return (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-amber-600">
          <Loader2 className="h-3 w-3 animate-spin" />
          分析中...
        </span>
      );
    }
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground">
        待分析
      </span>
    );
  };

  const getRecordIcon = (record: MedicalRecord) => {
    if (record.record_type?.includes('image') || record.file_url?.match(/\.(jpg|jpeg|png)$/i)) {
      return <Image className="h-5 w-5 text-primary" />;
    }
    return <FileText className="h-5 w-5 text-primary" />;
  };

  return (
    <main className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            病历管理
          </h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary gap-1.5 py-2"
          >
            <Upload className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">
              {uploading ? '上传中...' : '上传病历'}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </header>

      {/* Upload Drop Zone */}
      <section className="px-4 pt-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card py-8 transition-colors hover:border-primary/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
            <CloudUpload className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">点击或拖拽上传</span>
          <span className="text-xs text-muted-foreground">支持 PDF、JPG、PNG 格式</span>
        </button>
      </section>

      {/* Records List */}
      <section className="px-4 pt-5">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">我的病历</h2>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">加载中...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">暂无病历记录</div>
        ) : (
          <div className="flex flex-col gap-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  {getRecordIcon(record)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {record.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {record.record_type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {record.status !== 'analyzed' && (
                    <button
                      onClick={() => handleAnalyze(record.id)}
                      disabled={analyzingId === record.id}
                      className="text-xs text-primary font-medium whitespace-nowrap hover:underline"
                    >
                      {analyzingId === record.id ? '分析中...' : 'AI分析'}
                    </button>
                  )}
                  {getStatusBadge(record)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
