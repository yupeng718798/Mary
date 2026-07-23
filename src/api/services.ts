import apiClient, { DEMO_USER_ID } from './client';

export interface Profile {
  id: string;
  full_name?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  phone?: string | null;
  emergency_contact?: string | null;
  language?: string | null;
  created_at?: string | null;
}

export interface MedicalRecord {
  id: string;
  user_id: string;
  title: string;
  record_type: string;
  file_url?: string | null;
  status: string;
  upload_date?: string | null;
}

export interface MedicalAnalysis {
  id: string;
  record_id: string;
  agent_name?: string | null;
  summary?: string | null;
  risk_level?: string | null;
  created_at?: string | null;
}

export interface GeneratedReport {
  id: string;
  user_id: string;
  report_type?: string | null;
  content?: string | null;
  created_at?: string | null;
}

export interface Consultation {
  id: string;
  user_id: string;
  symptoms: string;
  ai_questions?: string | null;
  doctor_notes?: string | null;
  status: string;
  created_at?: string | null;
}

export interface Medication {
  id: string;
  user_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  reminder_time?: string | null;
  note?: string | null;
  created_at?: string | null;
}

export interface SymptomDiary {
  id: string;
  user_id: string;
  symptom: string;
  mood?: string | null;
  severity: number;
  notes?: string | null;
  created_at?: string | null;
}

const uid = () => DEMO_USER_ID;

export const profileApi = {
  get: (userId: string) => apiClient.get<Profile>(`/api/profile/${userId}`).then((r) => r.data),
  create: (data: Partial<Profile>) => apiClient.post<Profile>('/api/profile/', { ...data, id: userIdForCreate() }).then((r) => r.data),
  update: (userId: string, data: Partial<Profile>) => apiClient.put<Profile>(`/api/profile/${userId}`, data).then((r) => r.data),
};

function userIdForCreate() {
  return uid();
}

export const medicalApi = {
  upload: (formData: FormData) =>
    apiClient.post<MedicalRecord>('/api/medical/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  list: (userId: string) =>
    apiClient.get<MedicalRecord[]>(`/api/medical/records/${userId}`).then((r) => r.data),
  get: (recordId: string) =>
    apiClient.get<MedicalRecord>(`/api/medical/${recordId}`).then((r) => r.data),
  analyze: (recordId: string) =>
    apiClient.post<MedicalAnalysis>(`/api/medical/analyze/${recordId}`).then((r) => r.data),
  getAnalyses: (recordId: string) =>
    apiClient.get<MedicalAnalysis[]>(`/api/medical/analyze/${recordId}`).then((r) => r.data),
  generateReport: (recordId: string, userId: string, reportType = 'general') =>
    apiClient.post<GeneratedReport>('/api/medical/report/generate', {
      record_id: recordId,
      user_id: userId,
      report_type: reportType,
    }).then((r) => r.data),
  getReports: (userId: string) =>
    apiClient.get<GeneratedReport[]>(`/api/medical/report/${userId}`).then((r) => r.data),
};

export const consultationApi = {
  create: (userId: string, symptoms: string) =>
    apiClient.post<Consultation>('/api/consultation/create', { user_id: userId, symptoms }).then((r) => r.data),
  list: (userId: string) =>
    apiClient.get<Consultation[]>(`/api/consultation/${userId}`).then((r) => r.data),
  update: (consultationId: string, data: Partial<Consultation>) =>
    apiClient.put<Consultation>(`/api/consultation/${consultationId}`, data).then((r) => r.data),
};

export const medicationApi = {
  add: (data: Partial<Medication> & { user_id: string; medicine_name: string; dosage: string; frequency: string }) =>
    apiClient.post<Medication>('/api/medication/add', data).then((r) => r.data),
  list: (userId: string) =>
    apiClient.get<Medication[]>(`/api/medication/${userId}`).then((r) => r.data),
  remove: (medicationId: string) =>
    apiClient.delete<{ message: string }>(`/api/medication/${medicationId}`).then((r) => r.data),
};

export const diaryApi = {
  add: (data: { user_id: string; symptom: string; mood?: string; severity: number; notes?: string }) =>
    apiClient.post<SymptomDiary>('/api/diary/add', data).then((r) => r.data),
  list: (userId: string) =>
    apiClient.get<SymptomDiary[]>(`/api/diary/${userId}`).then((r) => r.data),
  agentLogs: (userId: string) =>
    apiClient.get<any[]>(`/api/diary/agent/logs/${userId}`).then((r) => r.data),
};

export interface AgentChatResponse {
  agent: string;
  agent_key: string;
  response: string;
}

export interface AgentInfo {
  key: string;
  name: string;
  description: string;
}

export interface AgentLog {
  id: string;
  agent_type: string;
  input: string;
  output: string;
  model?: string | null;
  created_at?: string | null;
}

export const agentApi = {
  chat: (userId: string, message: string) =>
    apiClient.post<AgentChatResponse>('/api/agent/chat', { user_id: userId, message }, { timeout: 120000 }).then((r) => r.data),
  list: () =>
    apiClient.get<AgentInfo[]>('/api/agent/list').then((r) => r.data),
  logs: (userId: string) =>
    apiClient.get<AgentLog[]>(`/api/agent/logs/${userId}`).then((r) => r.data),
};

export default apiClient;
