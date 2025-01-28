
interface Website {
    id: number;
    name: string;
}
export interface User {
    id: number;
    username: string;
    email: string;
    is_superuser: boolean;
    websites: Website[];
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
    token_type: string;
}


export interface UserBase {
    username: string;
    email: string; 
}

export interface UserRead extends UserBase {
    id: number;
}

export interface UserUpdate {
    username: string;
}