import apiClient from './apiClient'; // Use the central API client

// Define the shape of the API responses
interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  message: string;
}

/**
 * Makes a POST request to register a new user.
 * @param name - The user's full name.
 * @param email - The user's email.
 * @param password - The user's password.
 */
export const registerUser = (name: string, email: string, password: string) => {
  return apiClient.post<RegisterResponse>('/auth/register', { name, email, password });
};

/**
 * Makes a POST request to log in a user.
 * @param email - The user's email.
 * @param password - The user's password.
 */
export const loginUser = (email: string, password: string) => {
  return apiClient.post<LoginResponse>('/auth/login', { email, password });
};
