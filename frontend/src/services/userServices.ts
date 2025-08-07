import apiClient from './apiClient';

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
}

export const getProfile = () => {
    return apiClient.get<UserProfile>('/user/profile');
};

export const updateProfile = (name: string) => {
    return apiClient.put<UserProfile>('/user/profile', { name });
};