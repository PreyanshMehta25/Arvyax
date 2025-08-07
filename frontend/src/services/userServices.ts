import apiClient from './apiClient';

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
}

/**
 * Fetches the current user's profile data.
 */
export const getProfile = () => {
    return apiClient.get<UserProfile>('/user/profile');
};

/**
 * Updates the current user's name.
 * @param name - The new name for the user.
 */
export const updateProfile = (name: string) => {
    return apiClient.put<UserProfile>('/user/profile', { name });
};