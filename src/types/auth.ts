export interface User {
    id: number;
    username: string;
    email: string;
}
  
export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
