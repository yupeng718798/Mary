import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { medicalApi } from '../api/services';
import { Send, Bot, User, Loader2, Paperclip } from 'lucide-react';

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  agent?: string;
  agentKey?: string;
}

function getStorageKey(userId: string) {
  return `mary_chat_${userId}`;
}

export default function ChatPage() {
  const { userId, userName } = useApp();

  const getInitialMessages = (): ChatMessage[] => {
    try {
      const saved = localStorage.getItem(getStorageKey(userId));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        role: 'assistant',
        content: `Hello, ${userName || 'User'}!\n\nI'm Mary AI Assistant, here to help you with:\n- Query & analyze medical records\n- Manage medications & reminders\n- Consultation navigation & advice\n- Health overview & assessment\n\nHow can I help you today?`,
        agent: 'Mary AI',
        agentKey: 'assistant',
      },
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(messages));
  }, [messages, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    'How is my health?',
    'Review my recent lab reports',
    'What should I do about my headache?',
    'What medications am I taking?',
  ];

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch(`${API_BASE}/api/agent/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Add placeholder for streaming
      const placeholderIdx = messages.length + 1;
      setMessages((prev) => [...prev, { role: 'assistant', content: '', agent: '', agentKey: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'meta') {
              setMessages((prev) =>
                prev.map((m, i) =>
                  i === placeholderIdx
                    ? { ...m, agent: parsed.agent, agentKey: parsed.agent_key }
                    : m
                )
              );
            } else if (parsed.type === 'content') {
              setMessages((prev) =>
                prev.map((m, i) =>
                  i === placeholderIdx ? { ...m, content: m.content + parsed.content } : m
                )
              );
            } else if (parsed.type === 'error') {
              setMessages((prev) =>
                prev.map((m, i) =>
                  i === placeholderIdx
                    ? { ...m, content: `Sorry, error: ${parsed.content}` }
                    : m
                )
              );
            }
          } catch {}
        }
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, something went wrong: ${err.message || 'Please try again later'}`,
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
      { role: 'user', content: `Uploaded: ${file.name}` },
    ]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      formData.append('record_type', file.type.includes('pdf') ? 'pdf' : 'image');
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const record = await medicalApi.upload(formData);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `File "${file.name}" saved. Running AI analysis...`,
          agent: 'Medical Analysis Agent',
          agentKey: 'medical',
        },
      ]);

      if (record?.id) {
        const analysis = await medicalApi.analyze(record.id);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Analysis Result\n\n${analysis.summary || 'No summary available'}\n\nRisk Level: ${analysis.risk_level || 'Unknown'}`,
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
          content: `File processing failed: ${err.message || 'Please try again later'}`,
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
            <h1 className="text-[15px] font-semibold text-foreground">Mary AI Assistant</h1>
            <p className="text-xs text-muted-foreground">Smart Healthcare AI</p>
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
                {uploadingFile ? 'Processing file...' : 'AI thinking...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && !loading && !uploadingFile && (
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
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
            placeholder="Ask Mary anything..."
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