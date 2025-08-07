import apiClient from './apiClient'; 

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  message: string;
}

export const registerUser = (name: string, email: string, password: string) => {
  return apiClient.post<RegisterResponse>('/auth/register', { name, email, password });
};

export const loginUser = (email: string, password: string) => {
  return apiClient.post<LoginResponse>('/auth/login', { email, password });
};
