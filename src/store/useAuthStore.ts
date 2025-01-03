import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token: string, user: User) =>
        set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // unique name
      getStorage: () => localStorage, // storage method
    }
  )
);

export default useAuthStore;
