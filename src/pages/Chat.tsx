import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { agentApi, medicalApi } from '../api/services';
import type { AgentChatResponse } from '../api/services';
import { Send, Bot, User, Loader2, Paperclip } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  agent?: string;
  agentKey?: string;
}

export default function ChatPage() {
  const { userId, userName } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `你好，${userName || '用户'}！👋\n\n我是 Mary AI 助手，可以帮你：\n- 📋 查询和分析病历\n- 💊 管理药物和用药提醒\n- 🏥 问诊导航和就医建议\n- 📊 健康总览和综合评估\n\n有什么我可以帮你的吗？`,
      agent: 'Mary AI',
      agentKey: 'assistant',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    '我的健康状况怎么样？',
    '帮我看看最近的体检报告',
    '我头疼应该怎么办？',
    '我现在在吃什么药？',
  ];

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    try {
      const result: AgentChatResponse = await agentApi.chat(userId, text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.response,
          agent: result.agent,
          agentKey: result.agent_key,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `抱歉，出错了：${err.message || '请稍后再试'}`,
          agent: 'System',
          agentKey: 'system',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: `📎 上传了文件：${file.name}` },
    ]);

    try {
      // 1. 上传文件
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      formData.append('record_type', file.type.includes('pdf') ? 'pdf' : 'image');
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const record = await medicalApi.upload(formData);

      // 2. 显示上传成功
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ 文件「${file.name}」已保存，正在进行 AI 分析...`,
          agent: 'Medical Analysis Agent',
          agentKey: 'medical',
        },
      ]);

      // 3. 分析文件
      if (record?.id) {
        const analysis = await medicalApi.analyze(record.id);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `📋 **分析结果**\n\n${analysis.summary || '暂无摘要'}\n\n**风险等级：** ${analysis.risk_level || '未知'}`,
            agent: 'Medical Analysis Agent',
            agentKey: 'medical',
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ 文件处理失败：${err.message || '请稍后再试'}`,
          agent: 'System',
          agentKey: 'system',
        },
      ]);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleQuick = (q: string) => {
    setInput(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex flex-col h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-semibold text-foreground">Mary AI 助手</h1>
            <p className="text-xs text-muted-foreground">智能医疗健康助手</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === 'user' ? 'bg-primary-50' : 'bg-primary-50'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="h-4 w-4 text-primary" />
              ) : (
                <Bot className="h-4 w-4 text-primary" />
              )}
            </div>
            <div
              className={`max-w-[75%] ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              } flex flex-col gap-1`}
            >
              {msg.agent && msg.role === 'assistant' && (
                <span className="text-[11px] font-medium text-muted-foreground px-1">
                  {msg.agent}
                </span>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md text-foreground'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {(loading || uploadingFile) && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-card border border-border px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {uploadingFile ? '正在处理文件...' : 'AI 思考中...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && !loading && !uploadingFile && (
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">试试这些问题：</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleQuick(q)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="sticky bottom-16 border-t border-border bg-card px-4 py-3">
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileUpload}
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="问 Mary 任何健康问题..."
            rows={1}
            className="input resize-none max-h-32 min-h-[44px] py-2.5"
            style={{ height: 'auto' }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-primary h-11 w-11 shrink-0 p-0 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
