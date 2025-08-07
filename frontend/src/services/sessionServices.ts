import apiClient from './apiClient';

export interface Session {
  _id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  isLive: boolean;
  viewCount: number;
  updated_at: string;
  created_at: string;
  user_id: {
      _id: string;
      name: string;
      email: string;
  };
}

export const getUserSessions = () => apiClient.get<Session[]>('/session/my-sessions');
export const getSessionById = (id: string) => apiClient.get<Session>(`/session/my-sessions/${id}`);
export const saveDraft = (sessionData: Partial<Session>) => apiClient.post<Session>('/session/my-sessions/save-draft', sessionData);
export const publishSession = (sessionData: Partial<Session>) => apiClient.post<Session>('/session/my-sessions/publish', sessionData);
export const getPublicSessions = () => apiClient.get<Session[]>('/session/sessions');
export const deleteSession = (id: string) => apiClient.delete(`/session/my-sessions/${id}`);
export const toggleLiveStatus = (id: string) => apiClient.patch<Session>(`/session/my-sessions/${id}/live`);

export const incrementViewCount = (id: string) => {
    return apiClient.post(`/session/sessions/${id}/view`);
};